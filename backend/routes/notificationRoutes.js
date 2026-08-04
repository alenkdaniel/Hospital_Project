import express from "express";

import { protect } from "../middlewares/authMiddleware.js";

import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// ===============================
// ALL NOTIFICATION ROUTES ARE
// LOGGED-IN-USER ONLY
// ===============================

router.use(protect);

router.get("/", getMyNotifications);

router.get("/unread-count", getUnreadCount);

router.patch("/read-all", markAllAsRead);

router.patch("/:id/read", markAsRead);

router.delete("/:id", deleteNotification);

export default router;