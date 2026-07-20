import express from "express";

import {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  searchMedicines,
} from "../controllers/medicineController.js";

import {
  medicineValidation,
  updateMedicineValidation,
} from "../middlewares/validationMiddleware.js";

import {
  protect,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// =====================================
// CREATE MEDICINE
//
// Hospital Admin Only
//
// POST
// /api/medicines
// =====================================

router.post(
  "/",

  protect,

  authorizeRoles("hospital_admin"),

  medicineValidation,

  createMedicine,
);

// =====================================
// GET ALL MEDICINES
//
// Doctor / Hospital Admin
//
// GET
// /api/medicines
// =====================================

router.get(
  "/",

  protect,

  authorizeRoles(
    "hospital_admin",
    "doctor",
  ),

  getMedicines,
);

// =====================================
// SEARCH MEDICINES
//
// Doctor Autocomplete
//
// GET
// /api/medicines/search?keyword=par
// =====================================

router.get(
  "/search",

  protect,

  authorizeRoles(
    "hospital_admin",
    "doctor",
  ),

  searchMedicines,
);

// =====================================
// GET MEDICINE BY ID
//
// GET
// /api/medicines/:id
// =====================================

router.get(
  "/:id",

  protect,

  authorizeRoles(
    "hospital_admin",
    "doctor",
  ),

  getMedicineById,
);

// =====================================
// UPDATE MEDICINE
//
// PUT
// /api/medicines/:id
// =====================================

router.put(
  "/:id",

  protect,

  authorizeRoles("hospital_admin"),

  updateMedicineValidation,

  updateMedicine,
);

// =====================================
// DELETE MEDICINE
//
// DELETE
// /api/medicines/:id
// =====================================

router.delete(
  "/:id",

  protect,

  authorizeRoles("hospital_admin"),

  deleteMedicine,
);

export default router;