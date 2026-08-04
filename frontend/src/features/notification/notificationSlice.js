import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import notificationService from "./notificationService";

// =====================================
// ERROR HANDLER
// =====================================

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message || error.message || "Something went wrong"
  );
};

// =====================================
// INITIAL STATE
// =====================================

const initialState = {
  notifications: [],
  unreadCount: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,
  isError: false,
  message: "",
};

// =====================================
// FETCH NOTIFICATIONS
// =====================================

export const fetchNotifications = createAsyncThunk(
  "notification/fetchAll",

  async (params, thunkAPI) => {
    try {
      return await notificationService.getNotifications(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// FETCH UNREAD COUNT
// (used on app load, before the socket
// connects, to show the badge instantly)
// =====================================

export const fetchUnreadCount = createAsyncThunk(
  "notification/fetchUnreadCount",

  async (_, thunkAPI) => {
    try {
      return await notificationService.getUnreadCount();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// MARK AS READ
// =====================================

export const markNotificationAsRead = createAsyncThunk(
  "notification/markAsRead",

  async (id, thunkAPI) => {
    try {
      const data = await notificationService.markAsRead(id);
      return { id, notification: data.notification };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// MARK ALL AS READ
// =====================================

export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllAsRead",

  async (_, thunkAPI) => {
    try {
      return await notificationService.markAllAsRead();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// DELETE NOTIFICATION
// =====================================

export const deleteNotificationThunk = createAsyncThunk(
  "notification/delete",

  async (id, thunkAPI) => {
    try {
      await notificationService.deleteNotification(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// SLICE
// =====================================

const notificationSlice = createSlice({
  name: "notification",

  initialState,

  reducers: {
    // Called by the socket "notification:new" listener
    // to push a live notification into the list instantly.

    notificationReceived: (state, action) => {
      const exists = state.notifications.some(
        (n) => n._id === action.payload._id,
      );

      if (!exists) {
        state.notifications.unshift(action.payload);
      }

      state.unreadCount += 1;
    },

    resetNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.page = 1;
      state.totalPages = 1;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH ALL

      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;

        state.notifications =
          action.payload.page === 1
            ? action.payload.notifications
            : [...state.notifications, ...action.payload.notifications];

        state.unreadCount = action.payload.unreadCount;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // UNREAD COUNT

      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unreadCount;
      })

      // MARK ONE AS READ

      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n._id === action.payload.id,
        );

        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // MARK ALL AS READ

      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
        });

        state.unreadCount = 0;
      })

      // DELETE

      .addCase(deleteNotificationThunk.fulfilled, (state, action) => {
        const removed = state.notifications.find(
          (n) => n._id === action.payload,
        );

        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload,
        );

        if (removed && !removed.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  },
});

export const { notificationReceived, resetNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;