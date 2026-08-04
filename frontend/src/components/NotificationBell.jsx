import { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";

import toast from "react-hot-toast";

import { connectSocket, disconnectSocket, getSocket } from "../socket/socket";

import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationThunk,
  notificationReceived,
  resetNotifications,
} from "../features/notification/notificationSlice";

// =====================================
// TIME AGO HELPER
// =====================================

const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount, isLoading } = useSelector(
    (state) => state.notification,
  );

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ===============================
  // SOCKET CONNECTION LIFECYCLE
  // Connects when a user logs in,
  // disconnects on logout.
  // ===============================

  useEffect(() => {
    if (!user?.accessToken) {
      disconnectSocket();
      dispatch(resetNotifications());
      return;
    }

    // Initial state so the badge is correct
    // even before the socket connects.

    dispatch(fetchUnreadCount());

    const socket = connectSocket(user.accessToken);

    if (!socket) return;

    const handleNewNotification = (notification) => {
      dispatch(notificationReceived(notification));

      toast(notification.title, {
        icon: "🔔",
        duration: 4000,
      });
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.accessToken]);

  // ===============================
  // DISCONNECT ON UNMOUNT
  // (e.g. Navbar unmounts on full logout redirect)
  // ===============================

  useEffect(() => {
    return () => {
      if (!user) {
        disconnectSocket();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===============================
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // ===============================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);

    if (next) {
      dispatch(fetchNotifications({ page: 1, limit: 20 }));
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification._id));
    }

    setOpen(false);

    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    dispatch(markAllNotificationsAsRead());
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotificationThunk(id));
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-gray-600" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-80 max-w-[90vw] rounded-2xl border bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold text-gray-800">Notifications</h3>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && notifications.length === 0 && (
              <p className="p-4 text-center text-sm text-gray-500">
                Loading...
              </p>
            )}

            {!isLoading && notifications.length === 0 && (
              <p className="p-6 text-center text-sm text-gray-500">
                No notifications yet
              </p>
            )}

            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`group flex cursor-pointer gap-2 border-b px-4 py-3 last:border-b-0 hover:bg-gray-50 ${
                  !notification.isRead ? "bg-blue-50/60" : ""
                }`}
              >
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600 opacity-0 group-[.bg-blue-50\/60]:opacity-100" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    {notification.title}
                  </p>

                  <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                    {notification.message}
                  </p>

                  <p className="mt-1 text-[11px] text-gray-400">
                    {timeAgo(notification.createdAt)}
                  </p>
                </div>

                <div className="flex flex-shrink-0 items-start gap-1 opacity-0 group-hover:opacity-100">
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(markNotificationAsRead(notification._id));
                      }}
                      className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-blue-600"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}

                  <button
                    onClick={(e) => handleDelete(e, notification._id)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;