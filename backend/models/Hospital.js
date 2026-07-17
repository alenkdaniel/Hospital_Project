import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    // ===============================
    // BASIC DETAILS
    // ===============================

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    // ===============================
    // IMAGES
    // ===============================

    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    // ===============================
    // CONTACT
    // ===============================

    contact: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
      },

      website: {
        type: String,
        default: "",
      },
    },

    // ===============================
    // ADDRESS
    // ===============================

    address: {
      street: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
        index: true,
      },

      state: {
        type: String,
        default: "",
      },

      country: {
        type: String,
        default: "India",
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    // ===============================
    // LOCATION
    // ===============================

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (value) => value.length === 2,
          message: "Coordinates must contain longitude and latitude.",
        },
      },
    },

    // ===============================
    // DETAILS
    // ===============================

    hospitalType: {
      type: String,

      enum: ["Government", "Private", "Clinic", "Multi-Speciality"],

      default: "Private",
    },

    facilities: {
      type: [String],
      default: [],
    },

    departments: {
      type: [String],
      default: [],
    },

    emergency: {
      available: {
        type: Boolean,
        default: true,
      },

      ambulance: {
        type: Boolean,
        default: true,
      },
    },

    beds: {
      total: {
        type: Number,
        default: 0,
      },

      available: {
        type: Number,
        default: 0,
      },
    },

    open24Hours: {
      type: Boolean,
      default: true,
    },

    // ===============================
    // SEARCH
    // ===============================

    searchKeywords: {
      type: [String],
      default: [],
    },

    // ===============================
    // RATINGS
    // ===============================

    rating: {
      average: {
        type: Number,
        default: 0,
      },

      count: {
        type: Number,
        default: 0,
      },
    },

    // ===============================
    // OWNER
    // ===============================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    // ===============================
    // VERIFICATION
    // ===============================

    verification: {
      status: {
        type: String,

        enum: ["pending", "approved", "rejected"],

        default: "pending",
      },

      documents: {
        registrationNumber: String,

        licenseNumber: String,

        certificateUrl: String,
      },

      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",
      },

      approvedAt: Date,

      rejectReason: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

// =================================
// AUTO CREATE SLUG + SEARCH
// =================================

hospitalSchema.pre(
  "save",

  function () {
    if (this.name) {
      this.slug = this.name

        .toLowerCase()

        .trim()

        .replace(/\s+/g, "-");
    }

    this.searchKeywords = [
      this.name,

      this.address?.city,

      ...(this.departments || []),
    ]

      .filter(Boolean)

      .map((item) => item.toLowerCase());
  },
);

// =================================
// INDEXES
// =================================

hospitalSchema.index({
  location: "2dsphere",
});

hospitalSchema.index({
  "address.city": 1,

  "verification.status": 1,
});

hospitalSchema.index({
  departments: 1,
});

hospitalSchema.index({
  "rating.average": -1,
});

hospitalSchema.index({
  createdBy: 1,
});

hospitalSchema.index({
  name: "text",

  searchKeywords: "text",
});

// =================================
// EXPORT
// =================================

export default mongoose.model(
  "Hospital",

  hospitalSchema,
);
