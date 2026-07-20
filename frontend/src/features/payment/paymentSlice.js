import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import paymentService from "./paymentService";

// =====================================
// INITIAL STATE
// =====================================

const initialState = {
  order: null,

  payment: null,

  isLoading: false,

  isSuccess: false,

  isError: false,

  message: "",
};

// =====================================
// ERROR HANDLER
// =====================================

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message || error.message || "Something went wrong"
  );
};

// =====================================
// CREATE PAYMENT ORDER
//
// Razorpay Order Create
// =====================================

export const createPaymentOrder = createAsyncThunk(
  "payment/createOrder",

  async (
    appointmentId,

    thunkAPI,
  ) => {
    try {
      return await paymentService.createPaymentOrder(appointmentId);

      console.log("Appointment ID:", appointmentId);
      
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// VERIFY PAYMENT
//
// Razorpay Callback
// =====================================

export const verifyPayment = createAsyncThunk(
  "payment/verify",

  async (
    paymentData,

    thunkAPI,
  ) => {
    try {
      return await paymentService.verifyPayment(paymentData);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// SLICE
// =====================================

const paymentSlice = createSlice({
  name: "payment",

  initialState,

  reducers: {
    resetPayment: (state) => {
      state.isLoading = false;

      state.isSuccess = false;

      state.isError = false;

      state.message = "";
    },

    clearPayment: (state) => {
      state.order = null;
      state.payment = null;
      state.message = "";
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ============================
      // CREATE ORDER
      // ============================

      .addCase(createPaymentOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })

      .addCase(
        createPaymentOrder.fulfilled,

        (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.order = action.payload;
          state.payment = null;
        },
      )

      .addCase(
        createPaymentOrder.rejected,

        (state, action) => {
          state.isLoading = false;

          state.isError = true;

          state.message = action.payload;
        },
      )

      // ============================
      // VERIFY PAYMENT
      // ============================

      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })

      .addCase(
        verifyPayment.fulfilled,

        (state, action) => {
          state.isLoading = false;

          state.isSuccess = true;

          state.payment = action.payload.appointment;

          state.message = action.payload.message;

          state.order = null;
        },
      )

      .addCase(
        verifyPayment.rejected,

        (state, action) => {
          state.isLoading = false;

          state.isError = true;

          state.order = null;

          state.message = action.payload;
        },
      );
  },
});

export const {
  resetPayment,

  clearPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;
