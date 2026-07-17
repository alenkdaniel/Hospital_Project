import express from "express";

import {
  register,
  loginUser,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword,
  googleAuth,
  refreshAccessToken,
  logout,
  updateProfile,
  setPassword,
} from "../controllers/authController.js";

import { protect } from "../middlewares/authMiddleware.js";

import upload from "../middlewares/uploadMiddleware.js";

import {
  registerValidation,
  loginValidation,
} from "../middlewares/validationMiddleware.js";

import { authLimiter } from "../middlewares/securityMiddleware.js";

const router = express.Router();

router.post(
  "/register",

  authLimiter,

  upload.single("image"),

  registerValidation,

  register,
);

router.post(
  "/login",

  authLimiter,

  loginValidation,

  loginUser,
);

router.post(
  "/google",

  googleAuth,
);

// ===============================
// EMAIL VERIFICATION
// ===============================

router.post(
  "/verify-email",

  verifyEmail,
);
router.post("/resend-otp", authLimiter, resendOTP);

router.post(
  "/refresh-token",

  refreshAccessToken,
);

// ===============================
// PASSWORD RESET
// ===============================

router.post("/forgot-password", authLimiter, forgotPassword);

router.post("/reset-password",authLimiter, resetPassword);

router.put(
  "/profile",

  protect,

  upload.single("image"),

  updateProfile,
);

// =================================
// DOCTOR SET PASSWORD
// =================================

router.post(
  "/set-password",
  setPassword,
);

// ========================
// LOGOUT USER
// ========================

router.post(
  "/logout",

  protect,

  logout,
);


export default router;
