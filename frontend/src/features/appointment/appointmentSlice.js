import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import appointmentService from "./appointmentService";

// =====================================
// INITIAL STATE
// =====================================

const initialState = {
  appointments: [],

  appointment: null,

  hospitalAppointments: [],

  doctorAppointments: [],

  availableSlots: [],

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
// CREATE APPOINTMENT
// Patient
// =====================================

export const createAppointment = createAsyncThunk(
  "appointment/create",

  async (data, thunkAPI) => {
    try {
      return await appointmentService.createAppointment(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getAppointmentById = createAsyncThunk(
  "appointment/getById",

  async (id, thunkAPI) => {
    try {
      return await appointmentService.getAppointmentById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// GET PATIENT APPOINTMENTS
// =====================================

export const getMyAppointments = createAsyncThunk(
  "appointment/my",

  async (_, thunkAPI) => {
    try {
      return await appointmentService.getMyAppointments();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const cancelAppointment = createAsyncThunk(
  "appointment/cancel",

  async ({ id, reason }, thunkAPI) => {
    try {
      return await appointmentService.cancelAppointment(id, reason);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const rescheduleAppointment = createAsyncThunk(
  "appointment/reschedule",

  async ({ id, data }, thunkAPI) => {
    try {
      return await appointmentService.rescheduleAppointment(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// GET HOSPITAL APPOINTMENTS
// =====================================

export const getHospitalAppointments = createAsyncThunk(
  "appointment/hospital",

  async (_, thunkAPI) => {
    try {
      return await appointmentService.getHospitalAppointments();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// GET DOCTOR APPOINTMENTS
// =====================================

export const getDoctorAppointments = createAsyncThunk(
  "appointment/doctor",

  async (id, thunkAPI) => {
    try {
      return await appointmentService.getDoctorAppointments(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// UPDATE STATUS
// =====================================

export const updateAppointmentStatus = createAsyncThunk(
  "appointment/status",

  async (
    { id, status },

    thunkAPI,
  ) => {
    try {
      return await appointmentService.updateAppointmentStatus(
        id,

        status,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// Available Slots
// =====================================

export const getAvailableSlots = createAsyncThunk(
  "appointment/availableSlots",

  async ({ doctorId, date }, thunkAPI) => {
    try {
      return await appointmentService.getAvailableSlots(doctorId, date);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// SLICE
// =====================================

const appointmentSlice = createSlice({
  name: "appointment",

  initialState,

  reducers: {
    resetAppointment: (state) => {
      state.isLoading = false;

      state.isSuccess = false;

      state.isError = false;

      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // CREATE
      // =========================

      .addCase(
        createAppointment.pending,

        (state) => {
          state.isLoading = true;

          state.isSuccess = false;

          state.isError = false;

          state.message = "";
        },
      )

      .addCase(
        createAppointment.fulfilled,

        (state, action) => {
          state.isLoading = false;

          state.isSuccess = true;

          state.appointment = action.payload.appointment;

          state.appointments.unshift(action.payload.appointment);
        },
      )

      .addCase(
        createAppointment.rejected,

        (state, action) => {
          state.isLoading = false;

          state.isError = true;

          state.message = action.payload;
        },
      )

      .addCase(
        getMyAppointments.pending,

        (state) => {
          state.isLoading = true;

          state.isError = false;

          state.message = "";
        },
      )

      // =========================
      // MY APPOINTMENTS
      // =========================

      .addCase(
        getMyAppointments.fulfilled,

        (state, action) => {
          state.isLoading = false;

          state.isSuccess = true;

          state.appointments = action.payload.appointments;
        },
      )

      .addCase(
        getMyAppointments.rejected,

        (state, action) => {
          state.isLoading = false;

          state.isError = true;

          state.message = action.payload;
        },
      )

      // =========================
      // HOSPITAL APPOINTMENTS
      // =========================

      .addCase(
        getHospitalAppointments.pending,

        (state) => {
          state.isLoading = true;

          state.isError = false;

          state.message = "";
        },
      )

      .addCase(
        getHospitalAppointments.fulfilled,

        (state, action) => {
          state.isLoading = false;

          state.isSuccess = true;

          state.hospitalAppointments = action.payload.appointments;
        },
      )

      .addCase(
        getHospitalAppointments.rejected,

        (state, action) => {
          state.isLoading = false;

          state.isError = true;

          state.message = action.payload;
        },
      )

      // =========================
      // DOCTOR APPOINTMENTS
      // =========================

      .addCase(
        getDoctorAppointments.pending,

        (state) => {
          state.isLoading = true;

          state.isError = false;

          state.message = "";
        },
      )

      .addCase(
        getDoctorAppointments.fulfilled,

        (state, action) => {
          state.isLoading = false;

          state.isSuccess = true;

          state.doctorAppointments = action.payload.appointments;
        },
      )

      .addCase(
        getDoctorAppointments.rejected,

        (state, action) => {
          state.isLoading = false;

          state.isError = true;

          state.message = action.payload;
        },
      )

      // =====================================
      // AVAILABLE SLOTS
      // =====================================

      .addCase(getAvailableSlots.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })

      .addCase(getAvailableSlots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.availableSlots = action.payload.slots;
      })

      .addCase(getAvailableSlots.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getAppointmentById.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appointment = action.payload.appointment;
      })

      .addCase(getAppointmentById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(
        cancelAppointment.fulfilled,

        (state, action) => {
          const updated = action.payload.appointment;

          state.isLoading = false;

          state.isSuccess = true;

          state.appointment = updated;

          state.appointments = state.appointments.map((item) =>
            item._id === updated._id ? updated : item,
          );

          state.hospitalAppointments = state.hospitalAppointments.map((item) =>
            item._id === updated._id ? updated : item,
          );

          state.doctorAppointments = state.doctorAppointments.map((item) =>
            item._id === updated._id ? updated : item,
          );
        },
      )

      .addCase(
        rescheduleAppointment.fulfilled,

        (state, action) => {
          const updated = action.payload.appointment;

          state.isLoading = false;

          state.isSuccess = true;

          state.appointment = updated;

          state.appointments = state.appointments.map((item) =>
            item._id === updated._id ? updated : item,
          );

          state.hospitalAppointments = state.hospitalAppointments.map((item) =>
            item._id === updated._id ? updated : item,
          );

          state.doctorAppointments = state.doctorAppointments.map((item) =>
            item._id === updated._id ? updated : item,
          );
        },
      )

      // =========================
      // UPDATE STATUS
      // =========================

      .addCase(
        updateAppointmentStatus.pending,

        (state) => {
          state.isLoading = true;

          state.isError = false;

          state.message = "";
        },
      )

      .addCase(
        updateAppointmentStatus.fulfilled,

        (state, action) => {
          state.isLoading = false;

          state.isSuccess = true;

          const updated = action.payload.appointment;

          state.appointment = updated;

          state.appointments = state.appointments.map((item) =>
            item._id === updated._id ? updated : item,
          );

          state.hospitalAppointments = state.hospitalAppointments.map((item) =>
            item._id === updated._id ? updated : item,
          );

          state.doctorAppointments = state.doctorAppointments.map((item) =>
            item._id === updated._id ? updated : item,
          );
        },
      )

      .addCase(
        updateAppointmentStatus.rejected,

        (state, action) => {
          state.isLoading = false;

          state.isError = true;

          state.message = action.payload;
        },
      );
  },
});

export const { resetAppointment } = appointmentSlice.actions;

export default appointmentSlice.reducer;
