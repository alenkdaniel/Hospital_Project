import express from "express";

import {
  getHospitalsForAdmin,
  approveHospital,
  rejectHospital,
} from "../controllers/superAdminController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ===============================
// ALL ROUTES SUPER ADMIN ONLY
// ===============================

router.use(protect, authorizeRoles("super_admin"));

// ===============================
// GET HOSPITALS
// Super Admin Dashboard
// ===============================

// frontend calling:
// /api/super-admin/hospitals

router.get(
  "/hospitals",

  getHospitalsForAdmin,
);

// old route also works:
// /api/super-admin/hospitals/pending

router.get(
  "/hospitals/pending",

  getHospitalsForAdmin,
);

// ===============================
// APPROVE HOSPITAL
// ===============================

router.put(
  "/hospitals/:id/approve",

  approveHospital,
);

// ===============================
// REJECT HOSPITAL
// ===============================

router.put(
  "/hospitals/:id/reject",

  rejectHospital,
);

export default router;
