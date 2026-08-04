import mongoose from "mongoose";

// ===============================
// NOTIFICATION SCHEMA
// Stores every push notification so
// it survives page refresh / user
// being offline when it was sent.
// ===============================

const notificationSchema = new mongoose.Schema(
  {
    // ===============================
    // RECIPIENT
    // ===============================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // ===============================
    // TYPE
    // Used by the frontend to pick an
    // icon / route the click properly.
    // ===============================

    type: {
      type: String,

      enum: [
        "appointment_created",
        "appointment_confirmed",
        "appointment_cancelled",
        "appointment_rejected",
        "appointment_rescheduled",
        "appointment_checked_in",
        "appointment_in_consultation",
        "appointment_reminder",
        "consultation_completed",
        "general",
      ],

      default: "general",
    },

    // ===============================
    // OPTIONAL DEEP LINK
    // Frontend route to open on click
    // ===============================

    link: {
      type: String,
      default: "",
    },

    relatedAppointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

// ===================================
// DATABASE INDEXES
// ===================================

notificationSchema.index({ user: 1, createdAt: -1 });

notificationSchema.index({ user: 1, isRead: 1 });

export default mongoose.model("Notification", notificationSchema);