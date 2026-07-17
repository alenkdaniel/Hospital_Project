import crypto from "crypto";

import razorpay from "../config/razorpay.js";

import Appointment from "../models/Appointment.js";

import sendEmail from "../services/emailService.js";

import emailTemplate from "../templates/emailTemplate.js";

// =================================
// CREATE RAZORPAY ORDER
// =================================

export const createPaymentOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId)

      .populate("doctor", "name")

      .populate("hospital", "name")

      .populate("patient", "name email");

    if (!appointment) {
      // SECURITY CHECK

      if (!appointment.patient._id.equals(req.user._id)) {
        return res.status(403).json({
          message: "Not allowed",
        });
      }
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // ALREADY PAID CHECK

    if (appointment.payment.status === "paid") {
      return res.status(400).json({
        message: "Already paid",
      });
    }

    if (["cancelled", "completed"].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: `Appointment is ${appointment.status}`,
      });
    }

    const order = await razorpay.orders.create({
      amount: appointment.booking.consultationFee * 100,

      currency: "INR",

      receipt: appointment._id.toString(),
    });

    // SAVE ORDER ID

    appointment.payment.razorpayOrderId = order.id;

    await appointment.save();

    res.json({
      orderId: order.id,

      amount: order.amount,

      currency: order.currency,

      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// VERIFY PAYMENT
// =================================

export const verifyPayment = async (req, res) => {
  try {
    const {
      appointmentId,

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,
    } = req.body;

    // VERIFY SIGNATURE

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto

      .createHmac(
        "sha256",

        process.env.RAZORPAY_KEY_SECRET,
      )

      .update(body)

      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    const appointment = await Appointment.findById(appointmentId)

      .populate("patient", "name email")

      .populate("doctor", "name")

      .populate("hospital", "name");

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.payment.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay order.",
      });
    }

    // UPDATE PAYMENT

    if (appointment.payment.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already verified.",
      });
    }

    appointment.payment.status = "paid";

    appointment.payment.razorpayPaymentId = razorpay_payment_id;

    appointment.payment.razorpaySignature = razorpay_signature;

    appointment.payment.paidAt = new Date();

    appointment.payment.amount = appointment.booking.consultationFee;

    await appointment.save();

    // EMAIL

    try {
      await sendEmail({
        to: appointment.patient.email,

        subject: "Payment Successful",

        html: emailTemplate({
          title: "Payment Successful",

          greeting: appointment.patient.name,

          message:
            "Your payment was successful. Your appointment is now waiting for hospital confirmation.",

          details: `

Hospital : ${appointment.hospital.name}<br/>

Doctor : ${appointment.doctor.name}<br/>

Amount : ₹${appointment.booking.consultationFee}

`,
        }),
      });
    } catch (error) {
      console.error("Payment Email Error:", error);
    }

    res.json({
      message: "Payment verified successfully",

      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
