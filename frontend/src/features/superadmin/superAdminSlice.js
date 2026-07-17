import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import superAdminService from "./superAdminService";

// ================================
// INITIAL STATE
// ================================

const initialState = {
  hospitals: [],

  page: 1,

  pages: 1,

  total: 0,

  users: [],

  stats: null,

  isLoading: false,

  isSuccess: false,

  isError: false,

  message: "",
};

// ================================
// ERROR HANDLER
// ================================

const getError = (error) => {
  return (
    error.response?.data?.message || error.message || "Something went wrong"
  );
};

// ================================
// GET PENDING HOSPITALS
// ================================

export const getHospitalsForAdmin = createAsyncThunk(
  "superAdmin/hospitals",

async ({ page = 1, status = "all" }, thunkAPI) => {
  try {
    return await superAdminService.getHospitalsForAdmin(
      page,
      status
    );
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
},
);

// ================================
// APPROVE HOSPITAL
// ================================

export const approveHospital = createAsyncThunk(
  "superAdmin/approve",

  async (id, thunkAPI) => {
    try {
      return await superAdminService.approveHospital(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  },
);

// ================================
// REJECT HOSPITAL
// ================================

export const rejectHospital = createAsyncThunk(
  "superAdmin/reject",

  async (id, thunkAPI) => {
    try {
      return await superAdminService.rejectHospital(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  },
);

// ================================
// USERS
// ================================

export const getAllUsers = createAsyncThunk(
  "superAdmin/users",

  async (_, thunkAPI) => {
    try {
      return await superAdminService.getAllUsers();
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  },
);

// ================================
// USER STATUS
// ================================

export const updateUserStatus = createAsyncThunk(
  "superAdmin/userStatus",

  async (data, thunkAPI) => {
    try {
      return await superAdminService.updateUserStatus(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  },
);

// ================================
// STATS
// ================================

export const getDashboardStats = createAsyncThunk(
  "superAdmin/stats",

  async (_, thunkAPI) => {
    try {
      return await superAdminService.getDashboardStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  },
);

// ================================
// SLICE
// ================================

const superAdminSlice = createSlice({
  name: "superAdmin",

  initialState,

  reducers: {
    resetSuperAdmin: (state) => {
      state.isLoading = false;

      state.isSuccess = false;

      state.isError = false;

      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // GET HOSPITALS

      .addCase(
        getHospitalsForAdmin.fulfilled,

        (state, action) => {
          state.hospitals = action.payload.hospitals;

          state.page = action.payload.page;

          state.pages = action.payload.pages;

          state.total = action.payload.total;
        },
      )

      // APPROVE

      .addCase(
        approveHospital.fulfilled,

        (state, action) => {
          state.hospitals = state.hospitals.filter(
            (h) => h._id !== action.payload.hospital._id,
          );

          state.isSuccess = true;
        },
      )

      // REJECT

      .addCase(
        rejectHospital.fulfilled,

        (state, action) => {
          state.hospitals = state.hospitals.filter(
            (h) => h._id !== action.meta.arg,
          );

          state.isSuccess = true;
        },
      )

      // USERS

      .addCase(
        getAllUsers.fulfilled,

        (state, action) => {
          state.users = action.payload;
        },
      )

      .addCase(
        updateUserStatus.fulfilled,

        (state, action) => {
          state.users = state.users.map((user) =>
            user._id === action.payload._id ? action.payload : user,
          );
        },
      )

      // STATS

      .addCase(
        getDashboardStats.fulfilled,

        (state, action) => {
          state.stats = action.payload;
        },
      );
  },
});

export const { resetSuperAdmin } = superAdminSlice.actions;

export default superAdminSlice.reducer;
