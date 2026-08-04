import mongoose from "mongoose";

import Review from "../models/Review.js";

import Appointment from "../models/Appointment.js";

import Doctor from "../models/Doctor.js";

import Hospital from "../models/Hospital.js";

// ⭐ PUSH NOTIFICATIONS (SOCKET.IO)
import { createAndSendNotification } from "../services/notificationService.js";

// =====================================
// RECOMPUTE + SAVE A TARGET'S RATING
// (shared by doctor & hospital updates)
// =====================================

const recomputeDoctorRating = async (doctorId) => {
  const [stats] = await Review.aggregate([
    { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } },
    {
      $group: {
        _id: "$doctor",
        average: { $avg: "$doctorRating" },
        count: { $sum: 1 },
      },
    },
  ]);

  await Doctor.findByIdAndUpdate(doctorId, {
    rating: {
      average: stats ? Number(stats.average.toFixed(1)) : 0,
      count: stats ? stats.count : 0,
    },
  });
};

const recomputeHospitalRating = async (hospitalId) => {
  const [stats] = await Review.aggregate([
    { $match: { hospital: new mongoose.Types.ObjectId(hospitalId) } },
    {
      $group: {
        _id: "$hospital",
        average: { $avg: "$hospitalRating" },
        count: { $sum: 1 },
      },
    },
  ]);

  await Hospital.findByIdAndUpdate(hospitalId, {
    rating: {
      average: stats ? Number(stats.average.toFixed(1)) : 0,
      count: stats ? stats.count : 0,
    },
  });
};

// =====================================
// CREATE A REVIEW
// Patient only — one review per
// completed appointment, covering
// both the doctor and the hospital.
// =====================================

export const createReview = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const {
      doctorRating,
      doctorComment,
      hospitalRating,
      hospitalComment,
    } = req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can only review a completed appointment",
      });
    }

    if (appointment.isReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this appointment",
      });
    }

    const review = await Review.create({
      patient: req.user._id,
      appointment: appointment._id,
      doctor: appointment.doctor,
      hospital: appointment.hospital,
      doctorRating,
      doctorComment,
      hospitalRating,
      hospitalComment,
    });

    appointment.isReviewed = true;
    await appointment.save();

    // Recompute both aggregates in parallel

    await Promise.all([
      recomputeDoctorRating(appointment.doctor),
      recomputeHospitalRating(appointment.hospital),
    ]);

    // =================================
    // PUSH NOTIFICATION (SOCKET.IO)
    // Let the doctor + hospital admin
    // know they got new feedback.
    // =================================

    try {
      const [doctorDoc, hospitalDoc] = await Promise.all([
        Doctor.findById(appointment.doctor).select("user").lean(),
        Hospital.findById(appointment.hospital)
          .select("createdBy")
          .lean(),
      ]);

      const notifyTargets = [];

      if (doctorDoc?.user) notifyTargets.push(doctorDoc.user);

      if (hospitalDoc?.createdBy) {
        notifyTargets.push(hospitalDoc.createdBy);
      }

      await Promise.all(
        notifyTargets.map((userId) =>
          createAndSendNotification({
            user: userId,
            title: "New Review Received",
            message: `A patient left a review for appointment ${appointment.booking.appointmentNumber}.`,
            type: "general",
            link: `/appointments/${appointment._id}`,
            relatedAppointment: appointment._id,
          }),
        ),
      );
    } catch (notifyError) {
      console.error("Review Notification Error:", notifyError);
    }

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this appointment",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET REVIEWS FOR A DOCTOR
// =====================================

export const getDoctorReviews = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({
        doctor: req.params.doctorId,
        doctorComment: { $ne: "" },
      })
        .select("patient doctorRating doctorComment createdAt")
        .populate("patient", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Review.countDocuments({
        doctor: req.params.doctorId,
        doctorComment: { $ne: "" },
      }),
    ]);

    return res.status(200).json({
      success: true,
      reviews,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET REVIEWS FOR A HOSPITAL
// =====================================

export const getHospitalReviews = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({
        hospital: req.params.hospitalId,
        hospitalComment: { $ne: "" },
      })
        .select("patient hospitalRating hospitalComment createdAt")
        .populate("patient", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Review.countDocuments({
        hospital: req.params.hospitalId,
        hospitalComment: { $ne: "" },
      }),
    ]);

    return res.status(200).json({
      success: true,
      reviews,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET FEATURED REVIEWS (HOMEPAGE)
// Most recent reviews that actually
// have a comment on either side, so
// the homepage never shows an empty
// star rating with no context.
// =====================================

export const getFeaturedReviews = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;

    const reviews = await Review.find({
      $or: [
        { doctorComment: { $ne: "" } },
        { hospitalComment: { $ne: "" } },
      ],
    })
      .populate("patient", "name")
      .populate("doctor", "name specialization")
      .populate("hospital", "name")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET ALL REVIEWS (PAGINATED)
// Backs the public "/reviews" page.
// =====================================

export const getAllReviews = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({
        $or: [
          { doctorComment: { $ne: "" } },
          { hospitalComment: { $ne: "" } },
        ],
      })
        .populate("patient", "name")
        .populate("doctor", "name specialization")
        .populate("hospital", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Review.countDocuments({
        $or: [
          { doctorComment: { $ne: "" } },
          { hospitalComment: { $ne: "" } },
        ],
      }),
    ]);

    return res.status(200).json({
      success: true,
      reviews,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};