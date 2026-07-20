import Doctor from "../models/Doctor.js";

import Hospital from "../models/Hospital.js";

import User from "../models/User.js";

import Appointment from "../models/Appointment.js";

import crypto from "crypto";

import sendEmail from "../services/emailService.js";

import emailTemplate from "../templates/emailTemplate.js";

// ===============================
// GENERATE DOCTOR SLOTS
// ===============================

// const generateSlots = (start, end, duration = 30) => {
//   const slots = [];

//   if (!start || !end) {
//     return slots;
//   }

//   let current = new Date(`2000-01-01T${start}`);

//   const finish = new Date(`2000-01-01T${end}`);

//   while (current < finish) {
//     const slotStart = current.toTimeString().slice(0, 5);

//     current.setMinutes(current.getMinutes() + duration);

//     const slotEnd = current.toTimeString().slice(0, 5);

//     slots.push({
//       start: slotStart,

//       end: slotEnd,

//       isBooked: false,
//     });
//   }

//   return slots;
// };

export const createDoctor = async (req, res) => {
  try {
    let hospital;

    if (req.user.role === "super_admin") {
      hospital = await Hospital.findById(req.body.hospital);
    } else {
      hospital = await Hospital.findOne({
        createdBy: req.user._id,
      });
    }

    if (!hospital) {
      return res.status(404).json({
        message: "Hospital not found",
      });
    }

    if (hospital.verification.status !== "approved") {
      return res.status(403).json({
        message: "Hospital not approved",
      });
    }

    console.log("STEP 1 - Hospital found");

    const imageUrl = req.file ? req.file.path : "";

    console.log("STEP 2 - Image");

    // =================================
    // WEEKLY SCHEDULE
    // =================================

    let weeklySchedule = req.body.weeklySchedule || [];

    if (weeklySchedule.length === 0) {
      return res.status(400).json({
        message: "Please select working days",
      });
    }

    console.log("=================================");
    console.log("REQ BODY");
    console.log(req.body);

    console.log("=================================");
    console.log("WEEKLY SCHEDULE RAW");
    console.log(req.body.weeklySchedule);

    console.log("=================================");
    console.log("WEEKLY SCHEDULE PARSED");
    console.log(weeklySchedule);

    if (!Array.isArray(weeklySchedule)) {
      weeklySchedule = Object.values(weeklySchedule);
    }

    weeklySchedule = weeklySchedule.map((schedule) => ({
      day: schedule.day,

      isWorking: schedule.isWorking === true || schedule.isWorking === "true",

      startTime: schedule.startTime,

      endTime: schedule.endTime,

      slotDuration: Number(schedule.slotDuration) || 10,

      breaks: [],
    }));

    const passwordSetupToken = crypto.randomBytes(32).toString("hex");

    const passwordSetupExpires = new Date(Date.now() + 1000 * 60 * 60);

    console.log("STEP 3 - Weekly schedule ready");

    // =================================
    // CHECK IF DOCTOR EMAIL EXISTS
    // =================================

    try {
      // console.log("STEP 3.1");
      // console.log(req.body.contact);

      // console.log("STEP 3.2");
      // console.log(req.body.contact?.email);

      const existingUser = await User.findOne({
        email: req.body.contact.email,
      });

      // console.log("STEP 4 - Email checked");

      if (existingUser) {
        return res.status(400).json({
          message: "Doctor email already exists",
        });
      }

      const existingDoctor = await Doctor.findOne({
        licenseNumber: req.body.licenseNumber,
      });

      if (existingDoctor) {
        return res.status(400).json({
          message: "License number already exists",
        });
      }
    } catch (err) {
      // console.error("ERROR INSIDE User.findOne()");
      console.error(err);
      throw err;
    }

    // if (existingUser) {
    //   return res.status(400).json({
    //     message: "Doctor email already exists",
    //   });
    // }

    console.log("STEP 3.1 - Contact");
    console.log(req.body.contact);

    console.log("STEP 3.2 - Email");
    console.log(req.body.contact?.email);

    console.log("STEP 4 - Email checked");

    // =================================
    // CREATE DOCTOR USER ACCOUNT
    // =================================

    const user = await User.create({
      name: req.body.name,

      email: req.body.contact.email,

      phone: req.body.contact.phone,

      role: "doctor",

      authProvider: "local",

      accountStatus: "active",

      emailVerification: {
        isVerified: true,
      },

      passwordSetup: {
        token: passwordSetupToken,

        expiresAt: passwordSetupExpires,

        completed: false,
      },
    });

    console.log("STEP 5 - User created");

    const doctor = await Doctor.create({
      user: user._id,

      name: req.body.name,

      gender: req.body.gender,

      department: req.body.department,

      licenseNumber: req.body.licenseNumber,

      specialization: req.body.specialization,

      qualification: req.body.qualification,

      experience: Number(req.body.experience),

      consultationFee: Number(req.body.consultationFee),

      about: req.body.about,

      contact: req.body.contact,

      image: imageUrl || undefined,

      hospital: hospital._id,

      createdBy: req.user._id,

      weeklySchedule,
    });

    console.log("STEP 6 - Doctor created");

    // =================================
    // SEND PASSWORD SETUP EMAIL
    // =================================

    const setupLink = `${process.env.CLIENT_URL}/set-password?token=${passwordSetupToken}`;

    await sendEmail({
      to: user.email,

      subject: "Set Your Doctor Account Password",

      html: emailTemplate({
        title: "Welcome Doctor",

        greeting: user.name,

        message:
          "Your doctor account has been created successfully. Please click the button below to set your password.",

        actionText: "Set Password",

        actionUrl: setupLink,

        details: `
Hospital : ${hospital.name}<br/>
Role : Doctor<br/>
This link expires in 1 hour.
`,
      }),
    });
    console.log("STEP 7 - Email sent");

    res.status(201).json(doctor);
  } catch (error) {
    console.log(
      "CREATE DOCTOR ERROR:",

      error,
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyDoctors = async (req, res) => {
  try {
    let doctors;

    console.log("========== GET MY DOCTORS ==========");
    console.log("Logged in User:", req.user._id);
    console.log("Role:", req.user.role);

    if (req.user.role === "super_admin") {
      doctors = await Doctor.find()
        .populate("hospital", "name address")
        .sort({ createdAt: -1 });
    } else {
      const hospital = await Hospital.findOne({
        createdBy: req.user._id,
      });

      console.log("Hospital Found:");
      console.log(hospital);

      if (!hospital) {
        return res.status(404).json({
          message: "Hospital not found",
        });
      }

      doctors = await Doctor.find({
        hospital: hospital._id,
      })
        .populate("hospital", "name address")
        .sort({ createdAt: -1 });

      console.log("Doctors Found:", doctors.length);
      console.log(doctors);
    }

    res.json(doctors);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// ALL DOCTORS
// PATIENT SIDE
// ===============================

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      $or: [{ isAvailable: true }, { isAvailable: { $exists: false } }],
    })

      .populate(
        "hospital",

        "name address verification",
      );

    const approvedDoctors = doctors.filter(
      (doc) => doc.hospital?.verification?.status === "approved",
    );

    res.json(approvedDoctors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// DOCTORS BY HOSPITAL
// ===============================

export const getDoctorsByHospital = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      hospital: req.params.id,

      $or: [{ isAvailable: true }, { isAvailable: { $exists: false } }],
    })

      .sort({
        createdAt: -1,
      });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// SINGLE DOCTOR DETAILS
// ===============================

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)

      .populate("hospital");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// UPDATE DOCTOR
// ===============================

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    if (
      req.user.role !== "super_admin" &&
      doctor.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    if (req.file) {
      req.body.image = req.file.path;
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,

      req.body,

      {
        new: true,

        runValidators: true,
      },
    );

    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// DELETE DOCTOR
// ===============================

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    if (
      req.user.role !== "super_admin" &&
      doctor.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    await Doctor.findByIdAndDelete(req.params.id);

    res.json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// GET TODAY'S APPOINTMENTS
// ======================================

export const getTodayAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user._id,
    }).select("_id");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const appointments = await Appointment.find({
      doctor: doctor._id,

      appointmentDate: {
        $gte: today,
        $lt: tomorrow,
      },

      status: "confirmed",

      "payment.status": "paid",
    })
      .populate("patient", "name image opNumber gender phone dateOfBirth")
      .populate("hospital", "name")
      .sort({
        "slot.start": 1,
      })
      .lean();

    return res.status(200).json({
      success: true,

      count: appointments.length,

      data: appointments,
    });
  } catch (error) {
    console.error("GET TODAY APPOINTMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch today's appointments",
    });
  }
};
