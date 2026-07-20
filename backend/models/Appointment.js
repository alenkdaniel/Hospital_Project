import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // ===============================
    // PATIENT DETAILS
    // ===============================

    patient: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    // ===============================
    // HOSPITAL DETAILS
    // ===============================

    hospital: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Hospital",

      required: true,
    },

    // ===============================
    // DOCTOR DETAILS
    // ===============================

    doctor: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Doctor",

      required: true,
    },

    // ===============================
    // APPOINTMENT SLOT
    // ===============================

    appointmentDate: {
      type: Date,

      required: true,
    },

    // appointmentTime: {
    //   type: String,

    //   required: true,
    // },

    slot: {
      start: {
        type: String,
        required: true,
      },

      end: {
        type: String,
        required: true,
      },
    },

    // ===============================
    // APPOINTMENT STATUS
    // ===============================

    status: {
      type: String,

      enum: [
        "pending",
        "confirmed",
        "checked_in",
        "in_consultation",
        "completed",
        "cancelled",
        "rejected",
        "no_show",
      ],

      default: "pending",
    },

    // ===============================
    // PAYMENT DETAILS
    // ===============================

    payment: {
      status: {
        type: String,

        enum: ["pending", "paid", "failed", "refunded"],

        default: "pending",
      },

      amount: {
        type: Number,

        default: 0,
      },

      razorpayOrderId: String,

      razorpayPaymentId: String,

      razorpaySignature: String,

      paidAt: Date,
    },

    // ===============================
    // CANCELLATION DETAILS
    // ===============================

    cancellation: {
      reason: String,

      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",
      },

      cancelledAt: Date,
    },

    // ===============================
    // NOTES
    // ===============================

    queue: {

      consultationDuration: {
        type: Number,
        default: 10,
      },

      checkedIn: {
        type: Boolean,
        default: false,
      },

      checkedInAt: Date,

completedAt: {
  type: Date,
},
      queueStatus: {
        type: String,
        enum: [
          "waiting",
          "checked_in",
          "in_consultation",
          "completed",
          "missed",
        ],
        default: "waiting",
      },
    },

    booking: {
      appointmentNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      bookingSource: {
        type: String,
        enum: ["website", "mobile", "admin"],
        default: "website",
      },
      appointmentType: {
        type: String,
        enum: ["new", "follow-up"],
        default: "new",
      },
      consultationFee: {
        type: Number,
        required: true,
      },
    },

    medical: {
      symptoms: {
        type: String,

        default: "",
      },
      doctorNotes: {
        type: String,
        trim: true,
      },

      adminNotes: {
        type: String,
        trim: true,
      },
    },

    consultation: {
      diagnosis: {
        type: String,
        trim: true,
      },

      medicines: {
        type: [
          {
            medicine: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Medicine",
            },

            dosage: {
              type: String,
              trim: true,
            },

            frequency: {
              type: String,
              trim: true,
            },

            duration: {
              type: String,
              trim: true,
            },

            instructions: {
              type: String,
              trim: true,
            },
          },
        ],

        default: [],
      },

      tests: {
        type: [
          {
            test: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "MedicalTest",
            },

            notes: {
              type: String,
              trim: true,
            },

            status: {
              type: String,
              enum: ["recommended", "completed"],
              default: "recommended",
            },
          },
        ],

        default: [],
      },

attachments: {
  type: [
    {
      url: {
        type: String,
        trim: true,
      },

      name: {
        type: String,
        trim: true,
      },

      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  default: [],
},

      remarks: {
        type: String,
        trim: true,
      },

      followUpDate: Date,

consultationDate: {
  type: Date,
},
      completedAt: Date,

      completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },

      status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
      },
    },

    confirmation: {
      confirmedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      confirmedAt: Date,
      rejectionReason: String,
    },

    notifications: {
      confirmation: {
        sent: {
          type: Boolean,
          default: false,
        },
        sentAt: Date,
      },

      reminder: {
        sent: {
          type: Boolean,
          default: false,
        },
        sentAt: Date,
      },

      cancellation: {
        sent: {
          type: Boolean,
          default: false,
        },
        sentAt: Date,
      },
    },

    reschedule: {
      oldDate: Date,
      oldTime: String,
      reason: String,
      rescheduledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rescheduledAt: Date,
    },

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

// =====================================
// PREVENT DOUBLE SLOT BOOKING
// =====================================

appointmentSchema.index(
  {
    doctor: 1,

    appointmentDate: 1,

    "slot.start": 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: {
        $nin: ["cancelled", "rejected"],
      },
    },
  },
);

// =====================================
// QUERY PERFORMANCE INDEXES
// =====================================
appointmentSchema.index({
  patient: 1,
});

appointmentSchema.index({
  hospital: 1,
});

appointmentSchema.index({
  status: 1,
});

appointmentSchema.index({
  doctor: 1,
  appointmentDate: 1,
});

appointmentSchema.index({
  appointmentDate: 1,
});

appointmentSchema.index({
  createdAt: -1,
});

appointmentSchema.index({
  doctor: 1,
  status: 1,
  appointmentDate: 1,
});

export default mongoose.model(
  "Appointment",

  appointmentSchema,
);
