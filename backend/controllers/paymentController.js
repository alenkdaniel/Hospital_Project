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
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // SECURITY CHECK

    if (!appointment.patient._id.equals(req.user._id)) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    // ALREADY PAID CHECK

    if (appointment.payment.status === "paid") {
      return res.status(400).json({
        message: "Already paid",
      });
    }

    if (
      ["cancelled", "completed", "rejected", "no_show"].includes(
        appointment.status,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Appointment is ${appointment.status}`,
      });
    }

    // APPOINTMENT DATE CHECK

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointmentDate = new Date(appointment.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return res.status(400).json({
        success: false,
        message: "Appointment has expired",
      });
    }

    const amount =
      appointment.payment.amount || appointment.booking.consultationFee;

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,

      currency: "INR",

      receipt: appointment._id.toString(),
    });

    // SAVE ORDER ID

    appointment.payment.razorpayOrderId = order.id;

    appointment.payment.amount = amount;

    await appointment.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("CREATE PAYMENT ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the payment order.",
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

    if (!appointment.patient._id.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    if (
      ["cancelled", "completed", "rejected", "no_show"].includes(
        appointment.status,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Appointment is ${appointment.status}`,
      });
    }

    if (
      !appointment.payment.razorpayOrderId ||
      appointment.payment.razorpayOrderId !== razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay order.",
      });
    }

    // UPDATE PAYMENT

    if (
      appointment.payment.status === "paid" ||
      appointment.payment.status === "refunded"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment already completed or refunded.",
      });
    }

    appointment.payment.status = "paid";

    appointment.payment.razorpayPaymentId = razorpay_payment_id;

    appointment.payment.razorpaySignature = razorpay_signature;

    appointment.payment.paidAt = new Date();

    appointment.payment.amount =
      appointment.payment.amount || appointment.booking.consultationFee;

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

Amount : ₹${appointment.payment.amount}

`,
        }),
      });
    } catch (error) {
      console.error("Payment Email Error:", error);
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      appointment,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying the payment.",
    });
  }
};
