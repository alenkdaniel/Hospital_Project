import mongoose from "mongoose";

const medicalTestSchema = new mongoose.Schema(
  {
    // ===============================
    // BASIC DETAILS
    // ===============================

    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    category: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // ===============================
    // TEST INFORMATION
    // ===============================

    preparation: {
      type: String,
      trim: true,
    },

    fastingRequired: {
      type: Boolean,
      default: false,
    },

    estimatedDuration: {
      type: Number,
      default: 0,
    },

    // ===============================
    // STATUS
    // ===============================

    isActive: {
      type: Boolean,
      default: true,
    },

    // ===============================
    // AUDIT
    // ===============================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// ===============================
// INDEXES
// ===============================

medicalTestSchema.index({
  name: "text",
  category: "text",
});

medicalTestSchema.index({
  isActive: 1,
});

export default mongoose.model(
  "MedicalTest",
  medicalTestSchema,
);