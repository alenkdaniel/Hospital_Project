import express from "express";

import {
  createMedicalTest,
  getMedicalTests,
  getMedicalTestById,
  updateMedicalTest,
  deleteMedicalTest,
  searchMedicalTests,
} from "../controllers/medicalTestController.js";

import {
  medicalTestValidation,
  updateMedicalTestValidation,
} from "../middlewares/validationMiddleware.js";

import {
  protect,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// =====================================
// CREATE MEDICAL TEST
//
// Hospital Admin Only
//
// POST
// /api/medical-tests
// =====================================

router.post(
  "/",

  protect,

  authorizeRoles("hospital_admin"),

  medicalTestValidation,

  createMedicalTest,
);

// =====================================
// GET ALL MEDICAL TESTS
//
// Hospital Admin / Doctor
//
// GET
// /api/medical-tests
// =====================================

router.get(
  "/",

  protect,

  authorizeRoles(
    "hospital_admin",
    "doctor",
  ),

  getMedicalTests,
);

// =====================================
// SEARCH MEDICAL TESTS
//
// Doctor Autocomplete
//
// GET
// /api/medical-tests/search?keyword=blood
// =====================================

router.get(
  "/search",

  protect,

  authorizeRoles(
    "hospital_admin",
    "doctor",
  ),

  searchMedicalTests,
);

// =====================================
// GET MEDICAL TEST BY ID
//
// GET
// /api/medical-tests/:id
// =====================================

router.get(
  "/:id",

  protect,

  authorizeRoles(
    "hospital_admin",
    "doctor",
  ),

  getMedicalTestById,
);

// =====================================
// UPDATE MEDICAL TEST
//
// PUT
// /api/medical-tests/:id
// =====================================

router.put(
  "/:id",

  protect,

  authorizeRoles("hospital_admin"),

  updateMedicalTestValidation,

  updateMedicalTest,
);

// =====================================
// DELETE MEDICAL TEST
//
// DELETE
// /api/medical-tests/:id
// =====================================

router.delete(
  "/:id",

  protect,

  authorizeRoles("hospital_admin"),

  deleteMedicalTest,
);

export default router;