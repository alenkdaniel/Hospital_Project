import express from "express";

import {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  getHospitalAppointments,
  getDoctorAppointments,
  getAvailableSlots,
  updateAppointmentStatus,
  cancelAppointment,
  rescheduleAppointment,
  deleteUnpaidAppointment,
  completeConsultation,   
  getConsultationHistory,
  uploadConsultationAttachments,
} from "../controllers/appointmentController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

import { appointmentValidation } from "../middlewares/validationMiddleware.js";

import { consultationValidation } from "../middlewares/consultationValidation.js";

import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// =================================
// CREATE APPOINTMENT
// Patient Booking
// =================================

router.post(
  "/",

  protect,

  authorizeRoles("patient"),

  appointmentValidation,

  createAppointment,
);

// =================================
// PATIENT DASHBOARD
// My Appointments
// =================================

router.get(
  "/my",

  protect,

  authorizeRoles("patient"),

  getMyAppointments,
);

// =================================
// HOSPITAL ADMIN DASHBOARD
// All Hospital Appointments
// =================================

router.get(
  "/hospital",

  protect,

  authorizeRoles("hospital_admin"),

  getHospitalAppointments,
);

// =================================
// DOCTOR APPOINTMENTS
// =================================

router.get(
  "/doctor",

  protect,

  authorizeRoles("hospital_admin", "doctor", "super_admin"),

  getDoctorAppointments,
);


// =================================
// AVAILABLE SLOTS
// =================================

router.get(
  "/doctor/:doctorId/slots",

  protect,

  authorizeRoles("patient"),

  getAvailableSlots,
);

// =================================
// GET APPOINTMENT DETAILS
// =================================

router.get(
  "/:id",

  protect,

  getAppointmentById,
);

// =================================
// CANCEL APPOINTMENT
// =================================

router.patch(
  "/:id/cancel",

  protect,

  authorizeRoles("patient", "hospital_admin", "super_admin"),

  cancelAppointment,
);

// =================================
// RESCHEDULE APPOINTMENT
// =================================

router.patch(
  "/:id/reschedule",

  protect,

  authorizeRoles("patient", "hospital_admin", "super_admin"),

  rescheduleAppointment,
);

// =================================
// UPDATE APPOINTMENT STATUS
//
// pending
// confirmed
// completed
// cancelled
// =================================

router.patch(
  "/:id/status",

  protect,

  authorizeRoles(
    "hospital_admin",

    "doctor",

    "super_admin",
  ),

  updateAppointmentStatus,
);


// =================================
// COMPLETE CONSULTATION
// Doctor
// =================================

router.patch(
  "/:id/consultation",

  protect,

  authorizeRoles("doctor"),

  consultationValidation,

  completeConsultation,
);

// =================================
// CONSULTATION HISTORY
// PATIENT
// =================================

router.get(
  "/my/history",

  protect,

  authorizeRoles("patient"),

  getConsultationHistory,
);

router.patch(
  "/:id/attachments",

  protect,

  authorizeRoles("doctor"),

  upload.array("consultationAttachments", 10),

  uploadConsultationAttachments,
);

// =================================
// DELETE UNPAID APPOINTMENT
// =================================

router.delete(
  "/:id/unpaid",

  protect,

  authorizeRoles("patient"),

  deleteUnpaidAppointment,
);

export default router;
