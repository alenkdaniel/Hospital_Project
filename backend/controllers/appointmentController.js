import mongoose from "mongoose";

import Appointment from "../models/Appointment.js";

import Doctor from "../models/Doctor.js";

import { DAYS } from "../utils/constants.js";

import {
  generateAppointmentNumber,
  // generateTokenNumber,
  // calculateWaitingTime,
} from "../utils/appointmentUtils.js";

import Hospital from "../models/Hospital.js";

import sendEmail from "../services/emailService.js";

import emailTemplate from "../templates/emailTemplate.js";
import { convertTimeToMinutes } from "../utils/convertTime.js";

// =================================
// CREATE APPOINTMENT
// =================================

export const createAppointment = async (req, res) => {
  try {
    const { hospital, doctor, appointmentDate, slot, symptoms } = req.body;

    // ===============================
    // VALIDATE PAST DATE
    // ===============================

    const selectedDate = new Date(appointmentDate);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Past appointments cannot be booked.",
      });
    }

    // ======================================================
    // 1. Validate Hospital
    // ======================================================

    const hospitalExist = await Hospital.exists({
      _id: hospital,
      "verification.status": "approved",
      isActive: true,
      isDeleted: false,
    });

    if (!hospitalExist) {
      return res.status(404).json({
        success: false,
        message: "Hospital not available",
      });
    }

    // ======================================================
    // 2. Get Week Day
    // ======================================================

    const weekDay = DAYS[new Date(appointmentDate).getDay()];

    // ======================================================
    // 4. Validate Doctor Leave and Get Today's Schedule
    // ======================================================

    const doctorData = await Doctor.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(doctor),
          hospital: new mongoose.Types.ObjectId(hospital),
        },
      },
      {
        $project: {
          _id: 0,

          consultationFee: 1,

          todaySchedule: {
            $first: {
              $filter: {
                input: "$weeklySchedule",
                as: "schedule",
                cond: {
                  $and: [
                    { $eq: ["$$schedule.day", weekDay] },
                    { $eq: ["$$schedule.isWorking", true] },
                  ],
                },
              },
            },
          },

          doctorOnLeave: {
            $first: {
              $filter: {
                input: "$leaves",
                as: "leave",
                cond: {
                  $and: [
                    { $eq: ["$$leave.status", "Approved"] },
                    { $lte: ["$$leave.startDate", new Date(appointmentDate)] },
                    { $gte: ["$$leave.endDate", new Date(appointmentDate)] },
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    if (!doctorData.length) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    const schedule = doctorData[0]?.todaySchedule;

    const consultationFee = doctorData[0].consultationFee;

    const doctorOnLeave = doctorData[0]?.doctorOnLeave;

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Doctor schedule not found",
      });
    }

    if (doctorOnLeave) {
      return res.status(400).json({
        success: false,
        message: "Doctor is on leave",
      });
    }

    // ======================================================
    // 6. Validate Working Hours
    // ======================================================

    if (!slot?.start || !slot?.end) {
      return res.status(400).json({
        success: false,
        message: "Please select a slot.",
      });
    }

    const slotStart = convertTimeToMinutes(slot.start);
    const slotEnd = convertTimeToMinutes(slot.end);

    if (slotStart >= slotEnd) {
      return res.status(400).json({
        success: false,
        message: "Invalid slot.",
      });
    }

    const scheduleStart = convertTimeToMinutes(schedule.startTime);
    const scheduleEnd = convertTimeToMinutes(schedule.endTime);

    if (slotStart < scheduleStart || slotEnd > scheduleEnd) {
      return res.status(400).json({
        success: false,
        message: "Selected slot is outside doctor's working hours",
      });
    }

    // ======================================================
    // 7. Validate Break Time
    // ======================================================
    for (const breakTime of schedule.breaks) {
      const breakStart = convertTimeToMinutes(breakTime.start);
      const breakEnd = convertTimeToMinutes(breakTime.end);

      const isOverlap = slotStart < breakEnd && slotEnd > breakStart;

      if (isOverlap) {
        return res.status(400).json({
          success: false,
          message: `Doctor is unavailable due to ${breakTime.reason}`,
        });
      }
    }

    // ======================================================
    // 8. Check Slot Already Booked
    // ======================================================

    const existingAppointment = await Appointment.exists({
      doctor,
      appointmentDate,
      "slot.start": slot.start,
      status: {
        $nin: ["cancelled", "rejected"],
      },
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: "Selected slot is already booked.",
      });
    }

    // ======================================================
    // 9. Generate Appointment Number
    // ======================================================

    const appointmentNumber = generateAppointmentNumber();

    // ======================================================
    // 10. Create Appointment
    // ======================================================

    const appointment = await Appointment.create({
      patient: req.user._id,
      hospital,
      doctor,
      appointmentDate,
      slot,

      booking: {
        appointmentNumber,
        consultationFee,
      },

      medical: {
        symptoms,
      },

      createdBy: req.user._id,
    });

    const appointmentDetails = await Appointment.findById(appointment._id)
      .populate("patient", "name email")
      .populate("doctor", "name specialization")
      .populate("hospital", "name")
      .lean();

    // ======================================================
    // 11. Send Confirmation Email
    // ======================================================

    try {
      await sendEmail({
        to: appointmentDetails.patient.email,
        subject: "Appointment Confirmed",
        html: emailTemplate({
          title: "Payment Successful",
          greeting: appointmentDetails.patient.name,
          message:
            "Your payment was successful. Your appointment is now waiting for hospital confirmation.",
          details: `
Appointment No : ${appointment.booking.appointmentNumber}<br/>
Hospital : ${appointmentDetails.hospital.name}<br/>
Doctor : ${appointmentDetails.doctor.name}<br/>
Date : ${new Date(appointmentDate).toLocaleDateString("en-IN")}<br/>
Time : ${slot.start} - ${slot.end}<br/>
Amount : ₹${appointment.booking.consultationFee}
`,
        }),
      });
    } catch (emailError) {
      console.error("Appointment Email Error:", emailError);
    }

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      appointment: appointmentDetails,
    });
  } catch (error) {
    //duplicate-key handling

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Selected slot is already booked.",
      });
    }

    console.error("Create Appointment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =================================
// GET APPOINTMENT BY ID
// =================================

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email phone image")
      .populate("hospital", "name address contact")
      .populate("doctor", "name specialization image consultationFee email")
      .lean();
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // =================================
    // CHECK AUTHORIZATION
    // =================================

    if (req.user.role === "patient") {
      if (appointment.patient._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }
    }

    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({
        user: req.user._id,
      })
        .select("_id")
        .lean();

      if (
        !doctor ||
        appointment.doctor._id.toString() !== doctor._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }
    }

    if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({
        createdBy: req.user._id,
      })
        .select("_id")
        .lean();

      if (!hospital || !appointment.hospital._id.equals(hospital._id)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================================
// CANCEL APPOINTMENT
// =================================

export const cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email")
      .populate("hospital", "name createdBy")
      .populate("doctor", "name")
      .lean(false);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // =================================
    // CHECK AUTHORIZATION
    // =================================

    if (req.user.role === "patient") {
      if (!appointment.patient._id.equals(req.user._id)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }
    }

    if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({
        createdBy: req.user._id,
      })
        .select("_id")
        .lean();

      if (!hospital || !appointment.hospital._id.equals(hospital._id)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }
    }

    if (
      [
        "cancelled",
        "completed",
        "checked_in",
        "in_consultation",
        "rejected",
      ].includes(appointment.status)
    ) {
      return res.status(400).json({
        success: false,
        message: `Appointment cannot be cancelled because it is ${appointment.status}.`,
      });
    }

    appointment.status = "cancelled";

    if (appointment.payment.status === "paid") {
      appointment.payment.status = "refunded";
    }

    appointment.cancellation = {
      reason,
      cancelledBy: req.user._id,
      cancelledAt: new Date(),
    };

    await appointment.save();
    try {
      await sendEmail({
        to: appointment.patient.email,
        subject: "Appointment Cancelled",
        html: emailTemplate({
          title: "Appointment Cancelled",
          greeting: appointment.patient.name,
          message: "Your appointment has been cancelled.",
          details: `
Appointment No : ${appointment.booking.appointmentNumber}<br/>

Hospital : ${appointment.hospital.name}<br/>

Doctor : ${appointment.doctor.name}<br/>

Date : ${new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}<br/>

Time : ${appointment.slot.start} - ${appointment.slot.end}<br/>

Reason : ${reason}
`,
        }),
      });
    } catch (error) {
      console.error("Cancel Email Error:", error);
    }
    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================================
// RESCHEDULE APPOINTMENT
// =================================

export const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentDate, slot, reason } = req.body;

    // ===============================
    // VALIDATE PAST DATE
    // ===============================

    const selectedDate = new Date(appointmentDate);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Past appointments cannot be booked.",
      });
    }

    // =================================
    // FIND APPOINTMENT
    // =================================

    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email")
      .populate("doctor")
      .populate("hospital", "name");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // =================================
    // CHECK AUTHORIZATION
    // =================================

    // Patient
    if (req.user.role === "patient") {
      if (!appointment.patient._id.equals(req.user._id)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }
    }

    // Hospital Admin
    if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({
        createdBy: req.user._id,
      })
        .select("_id")
        .lean();

      if (!hospital || !appointment.hospital._id.equals(hospital._id)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to reschedule this appointment",
        });
      }
    }

    // =================================
    // CHECK STATUS
    // =================================

    if (
      ["cancelled", "completed", "in_consultation", "checked_in"].includes(
        appointment.status,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Cancelled appointments cannot be rescheduled",
      });
    }

    // =================================
    // GET DOCTOR SCHEDULE & LEAVE
    // =================================

    const weekDay = DAYS[new Date(appointmentDate).getDay()];

    const doctorData = await Doctor.aggregate([
      {
        $match: {
          _id: appointment.doctor._id,
          hospital: appointment.hospital._id,
        },
      },
      {
        $project: {
          _id: 0,

          todaySchedule: {
            $first: {
              $filter: {
                input: "$weeklySchedule",
                as: "schedule",
                cond: {
                  $and: [
                    { $eq: ["$$schedule.day", weekDay] },
                    { $eq: ["$$schedule.isWorking", true] },
                  ],
                },
              },
            },
          },

          doctorOnLeave: {
            $first: {
              $filter: {
                input: "$leaves",
                as: "leave",
                cond: {
                  $and: [
                    { $eq: ["$$leave.status", "Approved"] },
                    {
                      $lte: ["$$leave.startDate", new Date(appointmentDate)],
                    },
                    {
                      $gte: ["$$leave.endDate", new Date(appointmentDate)],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    if (!doctorData.length) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    const schedule = doctorData[0].todaySchedule;
    const doctorOnLeave = doctorData[0].doctorOnLeave;

    if (!schedule) {
      return res.status(400).json({
        success: false,
        message: "Doctor is not available on the selected day.",
      });
    }

    if (doctorOnLeave) {
      return res.status(400).json({
        success: false,
        message: "Doctor is on leave.",
      });
    }

    // =================================
    // VALIDATE SLOT
    // =================================

    const slotStart = convertTimeToMinutes(slot.start);
    const slotEnd = convertTimeToMinutes(slot.end);

    if (slotStart >= slotEnd) {
      return res.status(400).json({
        success: false,
        message: "Invalid slot.",
      });
    }

    const scheduleStart = convertTimeToMinutes(schedule.startTime);
    const scheduleEnd = convertTimeToMinutes(schedule.endTime);

    if (slotStart < scheduleStart || slotEnd > scheduleEnd) {
      return res.status(400).json({
        success: false,
        message: "Selected slot is outside doctor's working hours.",
      });
    }

    for (const breakTime of schedule.breaks) {
      const breakStart = convertTimeToMinutes(breakTime.start);
      const breakEnd = convertTimeToMinutes(breakTime.end);

      const isOverlap = slotStart < breakEnd && slotEnd > breakStart;

      if (isOverlap) {
        return res.status(400).json({
          success: false,
          message: `Doctor is unavailable due to ${breakTime.reason}`,
        });
      }
    }

    // =================================
    // CHECK DOUBLE BOOKING
    // =================================

    const alreadyBooked = await Appointment.exists({
      doctor: appointment.doctor._id,
      appointmentDate,
      "slot.start": slot.start,
      _id: { $ne: appointment._id },
      status: {
        $nin: ["cancelled", "rejected"],
      },
    });

    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: "Selected slot is already booked",
      });
    }
    // =================================
    // UPDATE APPOINTMENT
    // =================================

    appointment.reschedule = {
      oldDate: appointment.appointmentDate,
      oldTime: appointment.slot.start,
      reason,
      rescheduledBy: req.user._id,
      rescheduledAt: new Date(),
    };

    appointment.appointmentDate = appointmentDate;

    appointment.slot = {
      start: slot.start,
      end: slot.end,
    };

    appointment.status = "pending";

    await appointment.save();

    // =================================
    // SEND EMAIL
    // =================================
    try {
      await sendEmail({
        to: appointment.patient.email,

        subject: "Appointment Rescheduled",

        html: emailTemplate({
          title: "Appointment Rescheduled",

          greeting: appointment.patient.name,

          message:
            "Your appointment has been rescheduled successfully. Please check the updated appointment details below.",

          details: `
Appointment No : ${appointment.booking.appointmentNumber}<br/>

Hospital : ${appointment.hospital.name}<br/>

Doctor : ${appointment.doctor.name}<br/>

New Date : ${new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}<br/>

New Time : ${appointment.slot.start} - ${appointment.slot.end}<br/>

Reason : ${reason || "Not provided"}
`,
        }),
      });
    } catch (error) {
      console.error("Reschedule Email Error:", error);
    }
    return res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================================
// PATIENT APPOINTMENTS
// =================================

export const getMyAppointments = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Appointment.countDocuments({
      patient: req.user._id,
    });

    const appointments = await Appointment.find({
      patient: req.user._id,
    })
      .populate("hospital", "name address")
      .populate("doctor", "name specialization image")
      .sort({
        appointmentDate: -1,
        "slot.start": 1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      appointments,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// HOSPITAL APPOINTMENTS
// =================================

export const getHospitalAppointments = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({
      createdBy: req.user._id,
    })
      .select("_id")
      .lean();

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments({
      hospital: hospital._id,
    });

    const appointments = await Appointment.find({
      hospital: hospital._id,
    })
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization")
      .sort({
        appointmentDate: -1,
        "slot.start": 1,
      })
      .lean()
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// DOCTOR APPOINTMENTS
// =================================

export const getDoctorAppointments = async (req, res) => {
  try {
    let doctorId;

    if (req.user.role === "doctor") {
      // Find the doctor's profile using the logged-in user
      const doctor = await Doctor.findOne({
        user: req.user._id,
      })
        .select("_id")
        .lean();

      if (!doctor) {
        return res.status(404).json({
          message: "Doctor profile not found",
        });
      }

      doctorId = doctor._id;
    } else {
      doctorId = req.query.doctorId;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Appointment.countDocuments({
      doctor: doctorId,
    });

    const appointments = await Appointment.find({
      doctor: doctorId,
    })
      .populate("patient", "name email phone image")
      .sort({
        appointmentDate: 1,
        "slot.start": 1,
      })
      .lean()
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      appointments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// GET AVAILABLE SLOTS
// =================================

export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Valid appointment date is required.",
      });
    }

    const weekDay = DAYS[new Date(date).getDay()];

    console.log("Date:", date);
    console.log("Week Day:", weekDay);

    // const doctor = await Doctor.findById(doctorId).lean();

    // console.log(doctor);

    // if (!doctor) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Doctor not found",
    //   });
    // }

    const doctorData = await Doctor.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(doctorId),
        },
      },
      {
        $unwind: "$weeklySchedule",
      },
      {
        $match: {
          "weeklySchedule.day": weekDay,
          "weeklySchedule.isWorking": true,
        },
      },
      {
        $project: {
          _id: 0,
          schedule: "$weeklySchedule",
        },
      },
    ]);

    console.log("DoctorId:", doctorId);

    console.log("Doctor Data:", doctorData);

    const schedule = doctorData[0]?.schedule;

    if (!schedule) {
      return res.json({
        success: true,
        slots: [],
      });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: {
        $gte: start,
        $lte: end,
      },
      status: {
        $nin: ["cancelled", "rejected"],
      },
    })
      .select("slot")
      .lean();

    const bookedSlots = bookedAppointments.map((item) => item.slot.start);

    const slots = [];

    let current = convertTimeToMinutes(schedule.startTime);

    const scheduleEnd = convertTimeToMinutes(schedule.endTime);

    while (current + schedule.slotDuration <= scheduleEnd) {
      const slotStart = current;
      const slotEnd = current + schedule.slotDuration;

      let overlap = false;

      for (const br of schedule.breaks) {
        const breakStart = convertTimeToMinutes(br.start);
        const breakEnd = convertTimeToMinutes(br.end);

        if (slotStart < breakEnd && slotEnd > breakStart) {
          overlap = true;
          break;
        }
      }

      const hour = String(Math.floor(slotStart / 60)).padStart(2, "0");
      const minute = String(slotStart % 60).padStart(2, "0");

      const start = `${hour}:${minute}`;

      const endHour = String(Math.floor(slotEnd / 60)).padStart(2, "0");
      const endMinute = String(slotEnd % 60).padStart(2, "0");

      const finish = `${endHour}:${endMinute}`;

      if (!overlap && !bookedSlots.includes(start)) {
        slots.push({
          start,
          end: finish,
        });
      }

      current += schedule.slotDuration;
    }

    return res.json({
      success: true,
      slots,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================================
// UPDATE STATUS
// =================================

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email")
      .populate("doctor", "name user")
      .populate("hospital", "name createdBy");

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }
    const allowedStatuses = [
      "pending",
      "confirmed",
      "checked_in",
      "in_consultation",
      "completed",
      "cancelled",
      "rejected",
      "no_show",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
      });
    }

    if (req.user.role === "patient") {
      return res.status(403).json({
        success: false,
        message: "Patients cannot update appointment status.",
      });
    }

    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({
        user: req.user._id,
      })
        .select("_id")
        .lean();

      if (!doctor || !appointment.doctor._id.equals(doctor._id)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }
    }

    if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({
        createdBy: req.user._id,
      })
        .select("_id")
        .lean();

      if (!hospital || !appointment.hospital._id.equals(hospital._id)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }
    }

    const validTransitions = {
      pending: ["confirmed", "cancelled", "rejected"],

      confirmed: ["checked_in", "in_consultation", "cancelled", "no_show"],

      checked_in: ["in_consultation"],

      in_consultation: ["completed"],

      completed: [],

      cancelled: [],

      rejected: [],

      no_show: [],
    };

    if (appointment.status === status) {
      return res.status(400).json({
        success: false,

        message: "Appointment already has this status.",
      });
    }

    if (!validTransitions[appointment.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change appointment from "${appointment.status}" to "${status}"`,
      });
    }

    appointment.status = status;

    if (status === "confirmed") {
      appointment.confirmation.confirmedBy = req.user._id;

      appointment.confirmation.confirmedAt = new Date();
    }

    if (status === "rejected") {
      appointment.confirmation.rejectionReason =
        req.body.rejectionReason || "Rejected by hospital";
    }

    await appointment.save();

    if (
      status === "confirmed" ||
      status === "cancelled" ||
      status === "rejected"
    ) {
      try {
        await sendEmail({
          to: appointment.patient.email,

          subject: `Appointment ${status.replace("_", " ")}`,

          html: emailTemplate({
            title: "Appointment Status Updated",

            greeting: appointment.patient.name,

            message: `Your appointment status has been updated to "${status.replace("_", " ")}".`,

            details: `
Appointment No : ${appointment.booking.appointmentNumber}<br/>

Hospital : ${appointment.hospital.name}<br/>

Doctor : ${appointment.doctor.name}<br/>

Date : ${new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}<br/>

Time : ${appointment.slot.start} - ${appointment.slot.end}<br/>

Current Status : ${status.replace("_", " ")}
`,
          }),
        });
      } catch (error) {
        console.error("Status Email Error:", error);
      }
    }

    res.json({
      message: "Appointment updated",

      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
