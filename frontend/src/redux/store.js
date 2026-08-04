import { configureStore } from "@reduxjs/toolkit";

// =====================================
// REDUCERS IMPORT
// =====================================

import authReducer from "../redux/slices/authSlice";

import hospitalReducer from "../features/hospital/hospitalSlice";

import doctorReducer from "../features/doctor/doctorSlice";

import appointmentReducer from "../features/appointment/appointmentSlice";

import paymentReducer from "../features/payment/paymentSlice";

import superAdminReducer from "../features/superAdmin/superAdminSlice";

import notificationReducer from "../features/notification/notificationSlice";

import reviewReducer from "../features/review/reviewSlice";

// =====================================
// STORE CONFIGURATION
// =====================================

export const store = configureStore({
  reducer: {
    // =========================
    // AUTH MODULE
    // =========================

    auth: authReducer,

    // =========================
    // HOSPITAL MODULE
    // =========================

    hospital: hospitalReducer,

    // =========================
    // DOCTOR MODULE
    // =========================

    doctor: doctorReducer,

    // =========================
    // APPOINTMENT MODULE
    // =========================

    appointment: appointmentReducer,

    // =========================
    // PAYMENT MODULE
    // =========================

    payment: paymentReducer,

    // =========================
    // SUPER ADMIN MODULE
    // =========================

    superAdmin: superAdminReducer,

    // =========================
    // NOTIFICATION MODULE
    // =========================

    notification: notificationReducer,

    // =========================
    // REVIEW MODULE
    // =========================

    review: reviewReducer,
  },

  // =====================================
  // MIDDLEWARE CONFIGURATION
  // =====================================

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,

      immutableCheck: import.meta.env.MODE !== "production",
    }),

  // =====================================
  // REDUX DEVTOOLS
  // only development
  // =====================================

  devTools: import.meta.env.MODE !== "production",
});

export default store;