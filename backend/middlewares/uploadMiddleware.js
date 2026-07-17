import multer from "multer";

import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

// =====================================
// CLOUDINARY STORAGE
// =====================================

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    let folder = "healthcare";

    // ===============================
    // DYNAMIC FOLDERS
    // ===============================

    if (file.fieldname === "images") {
      folder = "healthcare/hospitals";
    }

    if (file.fieldname === "doctorImage") {
      folder = "healthcare/doctors";
    }

    if (file.fieldname === "profileImage") {
      folder = "healthcare/profiles";
    }

    if (file.fieldname === "certificate") {
      folder = "healthcare/certificates";
    }

    // ===============================
    // PDF SUPPORT
    // ===============================

    const isPdf = file.mimetype === "application/pdf";

    return {
      folder,

      resource_type: isPdf ? "raw" : "image",

      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],

      public_id: Date.now() + "-" + file.originalname.split(".")[0],

      transformation: !isPdf
        ? [
            {
              width: 1000,

              height: 1000,

              crop: "limit",

              quality: "auto",

              fetch_format: "auto",
            },
          ]
        : undefined,
    };
  },
});

// =====================================
// FILE VALIDATION
// =====================================

const fileFilter = (
  req,

  file,

  cb,
) => {
  const allowed = [
    "image/jpeg",

    "image/png",

    "image/jpg",

    "image/webp",

    "application/pdf",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type"),

      false,
    );
  }
};

// =====================================
// MULTER CONFIG
// =====================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,

    files: 10,
  },
});

// =====================================
// ERROR HANDLER
// use in routes if needed
// =====================================

export const uploadErrorHandler = (
  err,

  req,

  res,

  next,
) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      message: err.message || "Upload failed",
    });
  }

  next();
};

export default upload;
