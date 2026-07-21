import { body, validationResult } from "express-validator";

// =====================================
// VALIDATION RESULT
// =====================================

const validate = (req, res, next) => {
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
// COMPLETE CONSULTATION VALIDATION
// =====================================

export const consultationValidation = [
  body("diagnosis")
    .trim()
    .notEmpty()
    .withMessage("Diagnosis is required")
    .isLength({ max: 1000 })
    .withMessage("Diagnosis cannot exceed 1000 characters"),

  body("medicines")
    .optional()
    .isArray()
    .withMessage("Medicines must be an array"),

  body("medicines.*.medicine")
    .optional()
    .isMongoId()
    .withMessage("Invalid medicine id"),

  body("medicines.*.dosage")
    .optional()
    .trim(),

  body("medicines.*.frequency")
    .optional()
    .trim(),

  body("medicines.*.duration")
    .optional()
    .trim(),

  body("medicines.*.instructions")
    .optional()
    .trim(),

  body("tests")
    .optional()
    .isArray()
    .withMessage("Tests must be an array"),

  body("tests.*.test")
    .optional()
    .isMongoId()
    .withMessage("Invalid medical test id"),

  body("tests.*.notes")
    .optional()
    .trim(),

  body("remarks")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Remarks cannot exceed 1000 characters"),

  body("followUpDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid follow-up date"),

  validate,
];