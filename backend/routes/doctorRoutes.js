import express from "express";

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  getMyDoctors,
  getDoctorsByHospital,
  updateDoctor,
  deleteDoctor,
  getTodayAppointments,
} from "../controllers/doctorController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

import upload from "../middlewares/uploadMiddleware.js";

import { doctorValidation } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// =================================
// PUBLIC ROUTES
// =================================

// ALL DOCTORS

router.get(
  "/",

  getDoctors,
);

// DOCTORS OF PARTICULAR HOSPITAL

router.get(
  "/hospital/:id",

  getDoctorsByHospital,
);

// =================================
// HOSPITAL ADMIN DASHBOARD
// =================================

// MY DOCTORS

router.get(
  "/my-doctors",

  protect,

  authorizeRoles("hospital_admin", "super_admin"),

  getMyDoctors,
);

// =================================
// CREATE DOCTOR
// Cloudinary doctor image upload
// =================================

router.post(
  "/",

  protect,

  authorizeRoles("hospital_admin", "super_admin"),

  upload.single("doctorImage"),

  doctorValidation,

  createDoctor,
);

router.get(
  "/my-appointments",
  protect,
  authorizeRoles("doctor"),
  getTodayAppointments
);

// =================================
// SINGLE DOCTOR DETAILS
// keep below custom routes
// =================================

router.get(
  "/:id",

  getDoctorById,
);

// =================================
// UPDATE DOCTOR
// =================================

router.put(
  "/:id",

  protect,

  authorizeRoles("hospital_admin", "super_admin"),

  upload.single("doctorImage"),

  doctorValidation,

  updateDoctor,
);

// =================================
// DELETE DOCTOR
// =================================

router.delete(
  "/:id",

  protect,

  authorizeRoles("hospital_admin", "super_admin"),

  deleteDoctor,
);



export default router;
