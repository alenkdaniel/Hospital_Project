import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    // ===============================
    // BASIC DETAILS
    // ===============================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    genericName: {
      type: String,
      trim: true,
    },

    brandName: {
      type: String,
      trim: true,
    },

    // ===============================
    // MEDICINE INFORMATION
    // ===============================

    category: {
      type: String,
      trim: true,
    },

    dosageForm: {
      type: String,
      enum: [
        "Tablet",
        "Capsule",
        "Syrup",
        "Injection",
        "Cream",
        "Drops",
        "Inhaler",
        "Ointment",
        "Powder",
        "Other",
      ],
      default: "Tablet",
    },

    strength: {
      type: String,
      trim: true,
    },

    manufacturer: {
      type: String,
      trim: true,
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

medicineSchema.index({
  name: "text",
  genericName: "text",
  brandName: "text",
});

medicineSchema.index({
  category: 1,
});

medicineSchema.index({
  isActive: 1,
});

export default mongoose.model(
  "Medicine",
  medicineSchema,
);