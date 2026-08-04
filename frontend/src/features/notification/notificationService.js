import API from "../../api/axios";

// =====================================
// GET MY NOTIFICATIONS
// =====================================

const getNotifications = async (params = {}) => {
  const response = await API.get("/notifications", { params });

  return response.data;
};

// =====================================
// GET UNREAD COUNT
// =====================================

const getUnreadCount = async () => {
  const response = await API.get("/notifications/unread-count");

  return response.data;
};

// =====================================
// MARK ONE AS READ
// =====================================

const markAsRead = async (id) => {
  const response = await API.patch(`/notifications/${id}/read`);

  return response.data;
};

// =====================================
// MARK ALL AS READ
// =====================================

const markAllAsRead = async () => {
  const response = await API.patch("/notifications/read-all");

  return response.data;
};

// =====================================
// DELETE NOTIFICATION
// =====================================

const deleteNotification = async (id) => {
  const response = await API.delete(`/notifications/${id}`);

  return response.data;
};

const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};

export default notificationService;