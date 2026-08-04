import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

// ===============================
// MODULE STATE
// ===============================
// `io` is the single Socket.IO server instance for the whole app.
// `onlineUsers` maps userId -> Set(socketId) so one user can have
// multiple tabs/devices connected at the same time.
// ===============================

let io = null;

const onlineUsers = new Map();

// ===============================
// INIT SOCKET.IO
// Call this once, right after the
// HTTP server is created in server.js
// ===============================

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // ===============================
  // AUTH MIDDLEWARE
  // Same JWT access token used for
  // REST calls is used to authenticate
  // the socket handshake.
  // ===============================

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      const user = await User.findById(decoded.id).select("_id role name accountStatus");

      if (!user) {
        return next(new Error("Authentication error: user no longer exists"));
      }

      if (user.accountStatus === "blocked") {
        return next(new Error("Authentication error: account blocked"));
      }

      socket.userId = user._id.toString();
      socket.userRole = user.role;

      next();
    } catch (error) {
      next(new Error("Authentication error: invalid or expired token"));
    }
  });

  // ===============================
  // CONNECTION HANDLER
  // ===============================

  io.on("connection", (socket) => {
    const { userId } = socket;

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    // Every device/tab of this user joins a
    // personal room so we can target them
    // with `io.to("user_<id>").emit(...)`

    socket.join(`user_${userId}`);

    console.log(`🔌 Socket connected: user ${userId} (${socket.id})`);

    // ===============================
    // DISCONNECT
    // ===============================

    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(userId);

      if (sockets) {
        sockets.delete(socket.id);

        if (sockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }

      console.log(`🔌 Socket disconnected: user ${userId} (${socket.id})`);
    });
  });

  console.log("✅ Socket.IO initialized");

  return io;
};

// ===============================
// GET IO INSTANCE
// Used by controllers/services that
// need to emit events.
// ===============================

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initSocket(server) first.");
  }

  return io;
};

// ===============================
// IS USER ONLINE
// ===============================

export const isUserOnline = (userId) => onlineUsers.has(userId?.toString());

export default {
  initSocket,
  getIO,
  isUserOnline,
};