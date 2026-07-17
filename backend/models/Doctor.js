import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    // ===============================
    // DOCTOR LOGIN ACCOUNT
    // ===============================

    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    // ===============================
    // BASIC DETAILS
    // ===============================

    name: {
      type: String,

      required: true,

      trim: true,
    },

    gender: {
      type: String,

      enum: ["Male", "Female", "Other"],

      required: true,
    },

    image: {
      type: String,

      default:
        "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    },

    specialization: {
      type: String,

      required: true,

      index: true,
    },

    qualification: {
      type: String,

      trim: true,

      required: true,
    },

    department: {
      type: String,

      required: true,

      trim: true,

      index: true,
    },

    experience: {
      type: Number,

      required: true,

      default: 0,

      min: 0,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    // ===============================
    // CONTACT
    // ===============================

    contact: {
      email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },

    consultationFee: {
      type: Number,

      default: 0,

      min: 0,

      max: 100000,
    },

    // ===============================
    // APPOINTMENT AVAILABILITY
    // ===============================

    weeklySchedule: {
      type: [
        {
          day: {
            type: String,
            enum: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            required: true,
          },

          isWorking: {
            type: Boolean,
            default: false,
          },

          startTime: {
            type: String,
            default: "09:00",
          },

          endTime: {
            type: String,
            default: "17:00",
          },

          slotDuration: {
            type: Number,
            default: 10,
            min: 5,
            max: 60,
          },

          breaks: {
            type: [
              {
                start: {
                  type: String,
                  required: true,
                },

                end: {
                  type: String,
                  required: true,
                },

                reason: {
                  type: String,
                  enum: [
                    "Lunch",
                    "Tea Break",
                    "Meeting",
                    "Prayer",
                    "Emergency",
                    "Other",
                  ],
                  default: "Lunch",
                },
              },
            ],
            default: [],
          },
        },
      ],
      default: [],
    },

    //Leave Section
    leaves: {
      type: [
        {
          startDate: {
            type: Date,
            required: true,
          },

          endDate: {
            type: Date,
            required: true,
          },

          reason: {
            type: String,
            enum: ["Vacation", "Conference", "Medical", "Emergency", "Other"],
            default: "Other",
          },

          status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected", "Cancelled"],
            default: "Pending",
          },
        },
      ],
      default: [],
    },

    about: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // ===============================
    // HOSPITAL CONNECTION
    // ===============================

    hospital: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Hospital",

      required: true,

      index: true,
    },

    // ===============================
    // CREATED BY
    // ===============================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    // ===============================
    // RATING
    // ===============================

    rating: {
      average: {
        type: Number,

        default: 0,
        min: 0,
        max: 5,
      },

      count: {
        type: Number,

        default: 0,
      },
    },

    reviews: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },

          appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
          },

          comment: {
            type: String,
            trim: true,
            maxlength: 500,
          },

          rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
          },

          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },

  {
    timestamps: true,
  },
);

// ===============================
// DATABASE INDEXES
// ===============================

doctorSchema.index({
  specialization: 1,
  hospital: 1,
  department: 1,
});


export default mongoose.model(
  "Doctor",

  doctorSchema,
);
