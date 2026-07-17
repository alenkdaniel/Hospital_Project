import { body, validationResult } from "express-validator";

// =====================================
// VALIDATION RESULT HANDLER
// =====================================

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,

      message: "Validation failed",

      errors: errors.array().map((error) => ({
        field: error.path,

        message: error.msg,
      })),
    });
  }

  next();
};

// =====================================
// REGISTER VALIDATION
// =====================================

export const registerValidation = [
  body("name")
    .trim()

    .notEmpty()

    .withMessage("Name is required")

    .isLength({
      min: 3,
    })

    .withMessage("Name must contain minimum 3 characters"),

  body("email")
    .trim()

    .isEmail()

    .withMessage("Enter valid email address")

    .normalizeEmail(),

  body("password")
    .isLength({
      min: 6,
    })

    .withMessage("Password minimum 6 characters"),

  body("role")
    .optional()

    .isIn(["patient", "hospital_admin"])

    .withMessage("Invalid user role"),

  validate,
];

// =====================================
// LOGIN VALIDATION
// =====================================

export const loginValidation = [
  body("email")
    .isEmail()

    .withMessage("Enter valid email"),

  body("password")
    .notEmpty()

    .withMessage("Password required"),

  validate,
];

// =====================================
// VERIFY EMAIL OTP
// =====================================

export const otpValidation = [
  body("email")
    .isEmail()

    .withMessage("Valid email required"),

  body("otp")
    .notEmpty()

    .withMessage("OTP required"),

  validate,
];

// =====================================
// HOSPITAL VALIDATION
// =====================================

export const hospitalValidation = [
  body("name")
    .notEmpty()

    .withMessage("Hospital name required"),

  body("description")
    .notEmpty()

    .withMessage("Description required"),

  body("contact.email")
    .isEmail()

    .withMessage("Hospital email invalid"),

  body("contact.phone")
    .notEmpty()

    .withMessage("Phone required"),

  body("address.city")
    .notEmpty()

    .withMessage("City required"),

  validate,
];

// =====================================
// DOCTOR VALIDATION
// =====================================

export const doctorValidation = [
  body("name")
    .notEmpty()

    .withMessage("Doctor name required"),

  body("specialization")
    .notEmpty()

    .withMessage("Specialization required"),

  body("qualification")
    .notEmpty()

    .withMessage("Qualification required"),

  body("experience")
    .isNumeric()

    .withMessage("Experience should be number"),

  body("consultationFee")
    .isNumeric()

    .withMessage("Fee should be number"),

  validate,
];

// =====================================
// APPOINTMENT VALIDATION
// =====================================

export const appointmentValidation = [
  body("doctor")
    .notEmpty()

    .withMessage("Doctor required")

    .isMongoId()

    .withMessage("Invalid doctor id"),

  body("hospital")
    .notEmpty()

    .withMessage("Hospital required")

    .isMongoId()

    .withMessage("Invalid hospital id"),

  body("appointmentDate")
    .notEmpty()

    .withMessage("Date required"),

  body("appointmentTime")
    .notEmpty()

    .withMessage("Time required"),

  validate,
];

// =====================================
// APPOINTMENT STATUS VALIDATION
// =====================================

export const appointmentStatusValidation = [
  body("status")
    .isIn(["pending", "confirmed", "completed", "cancelled"])

    .withMessage("Invalid appointment status"),

  validate,
];

// =====================================
// PAYMENT ORDER VALIDATION
// =====================================

export const paymentValidation = [
  body("appointmentId")
    .notEmpty()

    .withMessage("Appointment id required")

    .isMongoId()

    .withMessage("Invalid appointment id"),

  validate,
];

// =====================================
// RAZORPAY VERIFY VALIDATION
// =====================================

export const verifyPaymentValidation = [
  body("appointmentId")
    .notEmpty()

    .withMessage("Appointment id required")

    .isMongoId()

    .withMessage("Invalid appointment id"),

  body("razorpay_order_id")
    .notEmpty()

    .withMessage("Order id required"),

  body("razorpay_payment_id")
    .notEmpty()

    .withMessage("Payment id required"),

  body("razorpay_signature")
    .notEmpty()

    .withMessage("Signature required"),

  validate,
];
