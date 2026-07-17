import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import doctorService from "./doctorService";

// =====================================
// INITIAL STATE
// =====================================

const initialState = {
  doctors: [],

  doctor: null,

  myDoctors: [],

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
// GET ALL DOCTORS
// =====================================

export const getDoctors = createAsyncThunk(
  "doctor/getAll",

  async (_, thunkAPI) => {
    try {
      return await doctorService.getDoctors();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// GET SINGLE DOCTOR
// =====================================

export const getDoctorById = createAsyncThunk(
  "doctor/getById",

  async (id, thunkAPI) => {
    try {
      return await doctorService.getDoctorById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// GET HOSPITAL DOCTORS
// =====================================

export const getDoctorsByHospital = createAsyncThunk(
  "doctor/byHospital",

  async (hospitalId, thunkAPI) => {
    try {
      return await doctorService.getDoctorsByHospital(hospitalId);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// GET MY DOCTORS
// Hospital Admin
// =====================================

export const getMyDoctors = createAsyncThunk(
  "doctor/myDoctors",

  async (_, thunkAPI) => {
    try {
      return await doctorService.getMyDoctors();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// CREATE DOCTOR
// =====================================

export const createDoctor = createAsyncThunk(
  "doctor/create",

  async (data, thunkAPI) => {
    try {
      return await doctorService.createDoctor(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// UPDATE DOCTOR
// =====================================

export const updateDoctor = createAsyncThunk(
  "doctor/update",

  async (
    { id, doctorData },

    thunkAPI,
  ) => {
    try {
      return await doctorService.updateDoctor(
        id,

        doctorData,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// DELETE DOCTOR
// =====================================

export const deleteDoctor = createAsyncThunk(
  "doctor/delete",

  async (id, thunkAPI) => {
    try {
      await doctorService.deleteDoctor(id);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// DOCTOR SLICE
// =====================================

const doctorSlice = createSlice({
  name: "doctor",

  initialState,

  reducers: {
    resetDoctor: (state) => {
      state.isLoading = false;

      state.isSuccess = false;

      state.isError = false;

      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // GET ALL
      // =========================

      .addCase(
        getDoctors.pending,

        (state) => {
          state.isLoading = true;
        },
      )

      .addCase(
        getDoctors.fulfilled,

        (state, action) => {
          state.isLoading = false;

          state.doctors = action.payload;
        },
      )

      .addCase(
        getDoctors.rejected,

        (state, action) => {
          state.isLoading = false;

          state.isError = true;

          state.message = action.payload;
        },
      )

      // =========================
      // SINGLE DOCTOR
      // =========================

      .addCase(
        getDoctorById.fulfilled,

        (state, action) => {
          state.doctor = action.payload;
        },
      )

      // =========================
      // HOSPITAL DOCTORS
      // =========================

      .addCase(
        getDoctorsByHospital.fulfilled,

        (state, action) => {
          state.doctors = action.payload;
        },
      )

      // =========================
      // MY DOCTORS
      // =========================

      .addCase(
        getMyDoctors.fulfilled,

        (state, action) => {
          state.myDoctors = action.payload;
        },
      )

      // =========================
      // CREATE
      // =========================

      .addCase(
        createDoctor.fulfilled,

        (state, action) => {
          state.myDoctors.unshift(action.payload);

          state.isSuccess = true;
        },
      )

      // =========================
      // UPDATE
      // =========================

      .addCase(
        updateDoctor.fulfilled,

        (state, action) => {
          state.myDoctors = state.myDoctors.map((doc) =>
            doc._id === action.payload._id ? action.payload : doc,
          );

          state.isSuccess = true;
        },
      )

      // =========================
      // DELETE
      // =========================

      .addCase(
        deleteDoctor.fulfilled,

        (state, action) => {
          state.myDoctors = state.myDoctors.filter(
            (doc) => doc._id !== action.payload,
          );
        },
      );
  },
});

export const { resetDoctor } = doctorSlice.actions;

export default doctorSlice.reducer;
