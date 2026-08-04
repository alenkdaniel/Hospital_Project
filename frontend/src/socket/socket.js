import { io } from "socket.io-client";

// =====================================
// SOCKET.IO CLIENT (SINGLETON)
//
// The backend API URL looks like:
//   https://api.example.com/api
// Socket.IO needs the bare origin
// (no /api suffix), so we strip it.
// =====================================

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  return apiUrl.replace(/\/api\/?$/, "");
};

let socket = null;

// =====================================
// CONNECT
// Call after login / on app load when
// an access token already exists.
// =====================================

export const connectSocket = (token) => {
  if (!token) return null;

  // Already connected with a live token — reuse it.
  if (socket?.connected) return socket;

  // A stale/disconnected instance exists — clean it up first.
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }

  socket = io(getSocketUrl(), {
    auth: { token },
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
};

// =====================================
// DISCONNECT
// Call on logout.
// =====================================

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

// =====================================
// GET CURRENT INSTANCE
// (may be null if never connected)
// =====================================

export const getSocket = () => socket;

export default { connectSocket, disconnectSocket, getSocket };