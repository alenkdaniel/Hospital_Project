import express from "express";

import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

import {
  paymentValidation,
  verifyPaymentValidation,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

// =================================
// CREATE RAZORPAY ORDER
//
// Patient only
//
// POST:
// /api/payments/create-order
//
// Body:
//
// {
//    appointmentId:""
// }
//
// =================================

router.post(
  "/create-order",

  // CHECK JWT TOKEN

  protect,

  // ONLY PATIENT CAN PAY

  authorizeRoles("patient"),

  // VALIDATE DATA

  paymentValidation,

  // CONTROLLER

  createPaymentOrder,
);

// =================================
// VERIFY RAZORPAY PAYMENT
//
// Called after successful payment
//
// POST:
// /api/payments/verify
//
// Body:
//
// {
//   appointmentId,
//   razorpay_order_id,
//   razorpay_payment_id,
//   razorpay_signature
// }
//
// =================================

router.post(
  "/verify",

  // CHECK JWT TOKEN

  protect,

  // ONLY PATIENT

  authorizeRoles("patient"),

  // VALIDATE RAZORPAY DATA

  verifyPaymentValidation,

  // CONTROLLER

  verifyPayment,
);

export default router;
