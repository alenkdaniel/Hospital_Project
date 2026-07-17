import express from "express";

import {
  createHospital,
  getHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
  getMyHospital,
  searchHospitals,
  getNearbyHospitals,
} from "../controllers/hospitalController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

import upload from "../middlewares/uploadMiddleware.js";

import { hospitalValidation } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// =====================================
// UPLOAD CONFIG
// =====================================

const hospitalUpload = upload.fields([
  {
    name: "images",

    maxCount: 5,
  },

  {
    name: "certificate",

    maxCount: 1,
  },
]);

// =====================================
// PUBLIC ROUTES
// =====================================

// GET ALL APPROVED HOSPITALS
// /api/hospitals

router.get(
  "/",

  getHospitals,
);

// SEARCH + FILTER
// /api/hospitals/search

router.get(
  "/search",

  searchHospitals,
);

// LOCATION BASED SEARCH
// /api/hospitals/nearby?lat=&lng=

router.get(
  "/nearby",

  getNearbyHospitals,
);

// =====================================
// HOSPITAL ADMIN ROUTES
// =====================================

// MY HOSPITAL PROFILE

router.get(
  "/my-hospital",

  protect,

  authorizeRoles("hospital_admin"),

  getMyHospital,
);

// CREATE HOSPITAL

router.post(
  "/",

  protect,

  authorizeRoles("hospital_admin"),

  hospitalUpload,

  hospitalValidation,

  createHospital,
);

// =====================================
// DYNAMIC ROUTES ALWAYS LAST
// =====================================

// SINGLE HOSPITAL DETAILS

router.get(
  "/:id",

  getHospitalById,
);

// UPDATE HOSPITAL

router.patch(
  "/:id",

  protect,

  authorizeRoles(
    "hospital_admin",

    "super_admin",
  ),

  hospitalUpload,

  hospitalValidation,

  updateHospital,
);

// FULL UPDATE SUPPORT (OPTIONAL)

router.put(
  "/:id",

  protect,

  authorizeRoles(
    "hospital_admin",

    "super_admin",
  ),

  hospitalUpload,

  hospitalValidation,

  updateHospital,
);

// DELETE HOSPITAL
// soft delete in controller

router.delete(
  "/:id",

  protect,

  authorizeRoles(
    "hospital_admin",

    "super_admin",
  ),

  deleteHospital,
);

export default router;
