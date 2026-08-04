import mongoose from "mongoose";

// ===============================
// REVIEW SCHEMA
//
// One review document per completed
// appointment. A single submission
// covers BOTH the doctor and the
// hospital, since a patient
// naturally has an opinion on both
// after a visit — no need for two
// separate forms/documents.
// ===============================

const reviewSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // One review per appointment — enforced
    // with a unique index below.

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    // ===============================
    // DOCTOR EXPERIENCE
    // ===============================

    doctorRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    doctorComment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    // ===============================
    // HOSPITAL EXPERIENCE
    // ===============================

    hospitalRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    hospitalComment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },

  {
    timestamps: true,
  },
);

// ===================================
// INDEXES
// ===================================

// Fast "latest reviews for this doctor/hospital" queries

reviewSchema.index({ doctor: 1, createdAt: -1 });

reviewSchema.index({ hospital: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);