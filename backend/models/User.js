import mongoose from "mongoose";

import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    // ===============================
    // BASIC INFORMATION
    // ===============================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      select: false,
    },

    image: {
      type: String,
      default: "",
    },

    // ===============================
    // ROLE MANAGEMENT
    // ===============================

    role: {
      type: String,

      enum: ["patient", "hospital_admin", "doctor", "super_admin"],

      default: "patient",
    },

    // ===============================
    // ACCOUNT STATUS
    // ===============================

    accountStatus: {
      type: String,

      enum: ["active", "pending", "blocked"],

      default: "active",
    },

    // ===============================
    // PATIENT INFORMATION
    // ===============================

    opNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    gender: {
      type: String,

      enum: ["male", "female", "other"],
    },

    dateOfBirth: {
      type: Date,
    },

    address: {
      street: String,

      city: String,

      state: String,

      country: {
        type: String,
        default: "India",
      },

      pincode: String,
    },
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },
    medicalProfile: {
      bloodGroup: String,

      allergies: [String],

      diseases: [String],

      emergencyContact: String,
    },

    // ===============================
    // LOGIN TYPE
    // ===============================

    authProvider: {
      type: String,

      enum: ["local", "google"],

      default: "local",
    },

    // ===============================
    // EMAIL VERIFICATION
    // ===============================

    emailVerification: {
      isVerified: {
        type: Boolean,

        default: false,
      },

      otp: {
        type: String,

        select: false,
      },

      expiresAt: {
        type: Date,
        select: false,
      },
      attempts: {
        type: Number,
        default: 0,
        select: false,
      },
    },

    // ===============================
    // REFRESH TOKEN
    // ===============================

    refreshToken: {
      type: String,

      select: false,
    },

    // ===============================
    // PASSWORD RESET
    // ===============================

    passwordReset: {
      otp: {
        type: String,
        select: false,
      },

      expiresAt: {
        type: Date,
        select: false,
      },
    },
    // ===============================
    // PASSWORD SETUP (DOCTOR FIRST LOGIN)
    // ===============================

    passwordSetup: {
      token: {
        type: String,
        select: false,
      },

      expiresAt: {
        type: Date,
        select: false,
      },

      completed: {
        type: Boolean,
        default: false,
      },
    },
    // ===============================
    // LOGIN HISTORY
    // ===============================

    lastLogin: {
      type: Date,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
    },
  },

  {
    timestamps: true,
  },
);

// ===================================
// AUTO GENERATE PATIENT OP NUMBER
// Mongoose 8 compatible
// ===================================

userSchema.pre(
  "save",

  function () {
    if (this.role === "patient" && !this.opNumber) {
      const random = crypto

        .randomBytes(3)

        .toString("hex")

        .toUpperCase();

      this.opNumber = `OP-${Date.now()}-${random}`;
    }
  },
);

// ===================================
// DATABASE INDEXES
// ===================================

userSchema.index({
  role: 1,
});

userSchema.index({
  accountStatus: 1,
});

export default mongoose.model(
  "User",

  userSchema,
);
