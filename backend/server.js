import "./config/env.js";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import startAppointmentReminderCron from "./cron/appointmentReminder.js";

// ⭐ ADD THIS
import { checkCloudinaryConnection } from "./config/cloudinary.js";

// ===============================
// SECURITY IMPORT
// ===============================

import {
  helmetSecurity,
  apiLimiter,
  sanitizeData,
  preventParameterPollution,
  requestSizeLimit,
} from "./middlewares/securityMiddleware.js";

// ===============================
// ERROR HANDLER IMPORT
// ===============================

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// ===============================
// ROUTES IMPORT
// ===============================

import authRoutes from "./routes/authRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// ===============================
// DATABASE + CLOUDINARY
// ===============================

connectDB();

// ⭐ ADD THIS
checkCloudinaryConnection();

// ===============================
// EXPRESS APP
// ===============================

const app = express();

// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",

    credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ===============================
// SECURITY
// ===============================

app.use(helmetSecurity);

app.use(apiLimiter);

app.use(sanitizeData);

app.use(preventParameterPollution);

app.use(requestSizeLimit);

// ===============================
// BODY PARSER
// ===============================

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

app.use(cookieParser());

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hospital Booking API Running...",
  });
});

// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/location", locationRoutes);

app.use("/api/hospitals", hospitalRoutes);

app.use("/api/doctors", doctorRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/super-admin", superAdminRoutes);

// ===============================
// ERROR HANDLER
// ===============================

app.use(notFound);

app.use(errorHandler);

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startAppointmentReminderCron();
});
