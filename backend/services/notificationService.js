import Notification from "../models/Notification.js";

import { getIO } from "../socket/socketServer.js";

// =======================================================
// CREATE + PUSH A SINGLE NOTIFICATION
//
// 1. Saves the notification in MongoDB so it is visible
//    the next time the user opens the notification list,
//    even if they were offline when it was created.
// 2. Emits it in real-time over Socket.IO to the user's
//    personal room (`user_<id>`) if they are online.
//
// This never throws — a notification failure should
// never break the calling controller (appointment
// booking, status update, etc).
// =======================================================

export const createAndSendNotification = async ({
  user,
  title,
  message,
  type = "general",
  link = "",
  relatedAppointment = null,
}) => {
  try {
    if (!user || !title || !message) {
      console.error("createAndSendNotification: missing required fields");
      return null;
    }

    const notification = await Notification.create({
      user,
      title,
      message,
      type,
      link,
      relatedAppointment: relatedAppointment || undefined,
    });

    try {
      const io = getIO();

      io.to(`user_${user.toString()}`).emit("notification:new", notification);
    } catch (socketError) {
      // Socket.io not initialized yet or emit failed — the
      // notification is still saved in the DB, so it's fine.
      console.error("Socket emit error:", socketError.message);
    }

    return notification;
  } catch (error) {
    console.error("Create Notification Error:", error);
    return null;
  }
};

// =======================================================
// SEND THE SAME NOTIFICATION TO MULTIPLE USERS
// =======================================================

export const notifyMany = async (userIds = [], payload = {}) => {
  const uniqueIds = [
    ...new Set(userIds.filter(Boolean).map((id) => id.toString())),
  ];

  return Promise.all(
    uniqueIds.map((id) =>
      createAndSendNotification({
        ...payload,
        user: id,
      }),
    ),
  );
};

export default {
  createAndSendNotification,
  notifyMany,
};