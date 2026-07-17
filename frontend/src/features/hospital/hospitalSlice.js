import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import hospitalService from "./hospitalService";

// =====================================
// INITIAL STATE
// =====================================

const initialState = {
  hospitals: [],

  hospital: null,

  myHospital: null,

  page: 1,

  pages: 1,

  total: 0,

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
// THUNKS
// =====================================

export const getHospitals = createAsyncThunk(
  "hospital/getAll",

  async (params, thunkAPI) => {
    try {
      return await hospitalService.getHospitals(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const searchHospitals = createAsyncThunk(
  "hospital/search",

  async (filters, thunkAPI) => {
    try {
      return await hospitalService.searchHospitals(filters);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getNearbyHospitals = createAsyncThunk(
  "hospital/nearby",

  async (location, thunkAPI) => {
    try {
      return await hospitalService.getNearbyHospitals(location);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getHospitalById = createAsyncThunk(
  "hospital/details",

  async (id, thunkAPI) => {
    try {
      return await hospitalService.getHospitalById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getMyHospital = createAsyncThunk(
  "hospital/my",

  async (_, thunkAPI) => {
    try {
      return await hospitalService.getMyHospital();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createHospital = createAsyncThunk(
  "hospital/create",

  async (data, thunkAPI) => {
    try {
      return await hospitalService.createHospital(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateHospital = createAsyncThunk(
  "hospital/update",

  async ({ id, hospitalData }, thunkAPI) => {
    try {
      return await hospitalService.updateHospital(
        id,

        hospitalData,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteHospital = createAsyncThunk(
  "hospital/delete",

  async (id, thunkAPI) => {
    try {
      await hospitalService.deleteHospital(id);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// SLICE
// =====================================

const hospitalSlice = createSlice({
  name: "hospital",

  initialState,

  reducers: {
    resetHospital: (state) => {
      state.isLoading = false;

      state.isSuccess = false;

      state.isError = false;

      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // =======================
      // GET ALL
      // =======================

      .addCase(
        getHospitals.fulfilled,

        (state, action) => {
          state.hospitals = action.payload.hospitals || action.payload;

          state.page = action.payload.page || 1;

          state.pages = action.payload.pages || 1;

          state.total = action.payload.total || 0;
        },
      )

      // =======================
      // SEARCH
      // =======================

      .addCase(
        searchHospitals.fulfilled,

        (state, action) => {
          state.hospitals = action.payload;
        },
      )

      // =======================
      // NEARBY
      // =======================

      .addCase(
        getNearbyHospitals.fulfilled,

        (state, action) => {
          state.hospitals = action.payload;
        },
      )

      // =======================
      // SINGLE HOSPITAL
      // =======================

      .addCase(
        getHospitalById.fulfilled,

        (state, action) => {
          state.hospital = action.payload;
        },
      )

      // =======================
      // MY HOSPITAL FIX
      // =======================

      .addCase(
        getMyHospital.fulfilled,

        (state, action) => {
          state.myHospital = action.payload;

          // IMPORTANT FIX

          state.hospital = action.payload;

          state.isSuccess = true;
        },
      )

      // =======================
      // CREATE
      // =======================

      .addCase(
        createHospital.fulfilled,

        (state, action) => {
          state.isSuccess = true;

          state.myHospital = action.payload.hospital;

          state.hospital = action.payload.hospital;
        },
      )

      // =======================
      // UPDATE
      // =======================

      .addCase(
        updateHospital.fulfilled,

        (state, action) => {
          state.isSuccess = true;

          state.myHospital = action.payload;

          state.hospital = action.payload;
        },
      )

      // =======================
      // DELETE
      // =======================

      .addCase(
        deleteHospital.fulfilled,

        (state, action) => {
          state.hospitals = state.hospitals.filter(
            (h) => h._id !== action.payload,
          );

          if (state.myHospital?._id === action.payload) {
            state.myHospital = null;

            state.hospital = null;
          }
        },
      )

      // =======================
      // LOADING
      // =======================

      .addMatcher(
        (action) =>
          action.type.startsWith("hospital/") &&
          action.type.endsWith("/pending"),

        (state) => {
          state.isLoading = true;

          state.isError = false;

          state.isSuccess = false;

          state.message = "";
        },
      )

      // =======================
      // ERROR
      // =======================

      .addMatcher(
        (action) =>
          action.type.startsWith("hospital/") &&
          action.type.endsWith("/rejected"),

        (state, action) => {
          state.isLoading = false;

          state.isError = true;

          state.isSuccess = false;

          state.message = action.payload;
        },
      )

      // =======================
      // SUCCESS
      // =======================

      .addMatcher(
        (action) =>
          action.type.startsWith("hospital/") &&
          action.type.endsWith("/fulfilled"),

        (state) => {
          state.isLoading = false;
        },
      );
  },
});

export const { resetHospital } = hospitalSlice.actions;

export default hospitalSlice.reducer;
