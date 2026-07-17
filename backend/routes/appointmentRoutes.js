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
} from "../controllers/appointmentController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

import { appointmentValidation } from "../middlewares/validationMiddleware.js";

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

export default router;
