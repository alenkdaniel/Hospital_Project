import { v2 as cloudinary } from "cloudinary";

// =====================================
// ENV VALIDATION
// =====================================


const requiredEnv = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing Cloudinary environment variable: ${key}`);
  }
});

// =====================================
// CLOUDINARY CONFIGURATION
// =====================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,

  secure: true,
});


// =====================================
// CHECK CONNECTION
// =====================================

export const checkCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();

    if (result.status === "ok") {
      console.log("Cloudinary connected successfully");
    }
  } catch (error) {
    console.error(
      "Cloudinary connection failed:",

      error.message,
    );
  }
};

// =====================================
// DELETE IMAGE
// =====================================

export const deleteCloudinaryFile = async (publicId) => {
  try {
    if (!publicId) {
      return;
    }

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(
      "Cloudinary delete error:",

      error.message,
    );
  }
};

// =====================================
// UPLOAD FILE
// optional helper
// =====================================

export const uploadToCloudinary = async (
  filePath,

  folder = "healthcare",
) => {
  try {
    const result = await cloudinary.uploader.upload(
      filePath,

      {
        folder,

        resource_type: "auto",
      },
    );

    return {
      url: result.secure_url,

      publicId: result.public_id,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export default cloudinary;
