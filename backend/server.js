import "./config/env.js";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// ⭐ SOCKET.IO — needs a raw http server to attach to
import http from "http";

import connectDB from "./config/db.js";

import startAppointmentReminderCron from "./cron/appointmentReminder.js";

import startSameDayReminderCron from "./cron/sameDayReminder.js";

// ⭐ ADD THIS
import { checkCloudinaryConnection } from "./config/cloudinary.js";

// ⭐ PUSH NOTIFICATIONS (SOCKET.IO)
import { initSocket } from "./socket/socketServer.js";

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

import medicineRoutes from "./routes/medicineRoutes.js";
import medicalTestRoutes from "./routes/medicalTestRoutes.js";

// ⭐ NOTIFICATION ROUTES
import notificationRoutes from "./routes/notificationRoutes.js";

// ⭐ REVIEW ROUTES
import reviewRoutes from "./routes/reviewRoutes.js";

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

app.use("/api/medicines", medicineRoutes);

app.use("/api/medical-tests", medicalTestRoutes);

app.use("/api/super-admin", superAdminRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/reviews", reviewRoutes);

// ===============================
// ERROR HANDLER
// ===============================

app.use(notFound);

app.use(errorHandler);

// ===============================
// SERVER + SOCKET.IO
// ===============================
//
// Express apps can't host a WebSocket
// server on their own — Socket.IO needs
// the raw http.Server instance so it can
// hijack the "upgrade" request. So we
// wrap `app` in an http server here and
// listen on that instead of `app.listen`.
// ===============================

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.IO listening on the same port`);
  startAppointmentReminderCron();
  startSameDayReminderCron();
});