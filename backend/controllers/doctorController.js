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
    const doctors = await Doctor.aggregate([
      // Only doctors marked available (or with no isAvailable field
      // at all, which defaults to available) — same condition as
      // before, still evaluated by MongoDB.
      {
        $match: {
          $or: [{ isAvailable: true }, { isAvailable: { $exists: false } }],
        },
      },

      // Join each doctor to their hospital document.
      {
        $lookup: {
          from: "hospitals",
          localField: "hospital",
          foreignField: "_id",
          as: "hospital",
        },
      },

      // $lookup always returns an array — a doctor has exactly
      // one hospital, so unwind it into a single object (and drop
      // the doctor entirely if the hospital reference is broken).
      {
        $unwind: "$hospital",
      },

      // This used to be a JS .filter() run after fetching every
      // doctor into memory — now it's evaluated by MongoDB, so
      // only approved-hospital doctors ever leave the database.
      {
        $match: {
          "hospital.verification.status": "approved",
        },
      },

      // Keep the hospital payload the same shape .populate(
      // "hospital", "name address verification") used to return.
      {
        $project: {
          "hospital.name": 1,
          "hospital.address": 1,
          "hospital.verification": 1,
          name: 1,
          gender: 1,
          image: 1,
          specialization: 1,
          qualification: 1,
          department: 1,
          experience: 1,
          licenseNumber: 1,
          contact: 1,
          consultationFee: 1,
          weeklySchedule: 1,
          leaves: 1,
          about: 1,
          rating: 1,
          isAvailable: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    res.json(doctors);
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

// ===============================
// DOCTOR SELF-SERVICE
// GET MY PROFILE
// ===============================

export const getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user._id,
    }).populate("hospital", "name address");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
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
// DOCTOR SELF-SERVICE
// UPDATE MY WORKING DAYS
// ===============================

const VALID_WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const isValidTime = (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

export const updateMySchedule = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    let incoming = req.body.weeklySchedule;

    if (!incoming) {
      return res.status(400).json({
        message: "weeklySchedule is required",
      });
    }

    if (!Array.isArray(incoming)) {
      incoming = Object.values(incoming);
    }

    if (incoming.length === 0) {
      return res.status(400).json({
        message: "Please provide at least one day",
      });
    }

    // Keep a lookup of the doctor's current schedule so
    // slotDuration / breaks aren't lost for days not being changed.
    const existingByDay = {};

    doctor.weeklySchedule.forEach((entry) => {
      existingByDay[entry.day] = entry;
    });

    const seenDays = new Set();
    const nextSchedule = [];

    for (const entry of incoming) {
      const day = entry.day;

      if (!VALID_WEEK_DAYS.includes(day)) {
        return res.status(400).json({
          message: `Invalid day: ${day}`,
        });
      }

      if (seenDays.has(day)) {
        return res.status(400).json({
          message: `Duplicate day in schedule: ${day}`,
        });
      }

      seenDays.add(day);

      const isWorking =
        entry.isWorking === true || entry.isWorking === "true";

      const startTime =
        entry.startTime || existingByDay[day]?.startTime || "09:00";

      const endTime =
        entry.endTime || existingByDay[day]?.endTime || "17:00";

      if (isWorking && (!isValidTime(startTime) || !isValidTime(endTime))) {
        return res.status(400).json({
          message: `Please provide a valid start/end time for ${day}`,
        });
      }

      if (isWorking && startTime >= endTime) {
        return res.status(400).json({
          message: `Start time must be before end time on ${day}`,
        });
      }

      const slotDuration =
        Number(entry.slotDuration) || existingByDay[day]?.slotDuration || 10;

      nextSchedule.push({
        day,
        isWorking,
        startTime,
        endTime,
        slotDuration,
        // A doctor edits which days/hours they work — existing
        // breaks for that day are preserved as-is here.
        breaks: existingByDay[day]?.breaks || [],
      });
    }

    doctor.weeklySchedule = nextSchedule;

    await doctor.save();

    res.json(doctor);
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