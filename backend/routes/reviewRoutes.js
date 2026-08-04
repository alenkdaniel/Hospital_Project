import express from "express";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

import { reviewValidation } from "../middlewares/validationMiddleware.js";

import {
  createReview,
  getDoctorReviews,
  getHospitalReviews,
  getFeaturedReviews,
  getAllReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

// ===============================
// PUBLIC
// ===============================

router.get("/featured", getFeaturedReviews);

router.get("/", getAllReviews);

router.get("/doctor/:doctorId", getDoctorReviews);

router.get("/hospital/:hospitalId", getHospitalReviews);

// ===============================
// PATIENT ONLY
// ===============================

router.post(
  "/:appointmentId",

  protect,

  authorizeRoles("patient"),

  reviewValidation,

  createReview,
);

export default router;