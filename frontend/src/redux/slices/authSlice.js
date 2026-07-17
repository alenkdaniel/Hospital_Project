import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import authService from "../../features/auth/authService";

// =====================================
// SAFE LOAD USER
// =====================================

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;
  } catch (error) {
    localStorage.clear();

    return null;
  }
};

// =====================================
// INITIAL STATE
// =====================================

const initialState = {
  user: getUserFromStorage(),

  registerEmail: "",

  isAuthenticated: !!localStorage.getItem("accessToken"),

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
// REGISTER
// =====================================

export const register = createAsyncThunk(
  "auth/register",

  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// LOGIN
// =====================================

export const login = createAsyncThunk(
  "auth/login",

  async (loginData, thunkAPI) => {
    try {
      return await authService.login(loginData);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// GOOGLE AUTH
// =====================================

export const googleAuth = createAsyncThunk(
  "auth/google",

  async (data, thunkAPI) => {
    try {
      return await authService.googleAuth(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// VERIFY EMAIL
// =====================================

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",

  async (data, thunkAPI) => {
    try {
      return await authService.verifyEmail(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// UPDATE PROFILE
// =====================================

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",

  async (data, thunkAPI) => {
    try {
      return await authService.updateProfile(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// LOGOUT
// =====================================

export const logout = createAsyncThunk(
  "auth/logout",

  async (_, thunkAPI) => {
    try {
      await authService.logout();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// SLICE
// =====================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    reset: (state) => {
      state.isLoading = false;

      state.isSuccess = false;

      state.isError = false;

      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // REGISTER

      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })

      // .addCase(register.fulfilled, (state, action) => {
      //   state.isLoading = false;

      //   state.isSuccess = true;

      //   state.isAuthenticated = true;

      //   state.user = action.payload;

      //   localStorage.setItem("user", JSON.stringify(action.payload));

      //   localStorage.setItem("accessToken", action.payload.accessToken);

      //   localStorage.setItem("refreshToken", action.payload.refreshToken);
      // })

      .addCase(register.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isSuccess = true,
        state.isAuthenticated = false,
        state.user = null
        state.message = action.payload.message
        state.registerEmail = action.payload.email
      })

      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;

        state.isError = true;

        state.message = action.payload;
      })

      // LOGIN

      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;

        state.isSuccess = true;

        state.isAuthenticated = true;

        state.user = action.payload;

        localStorage.setItem("user", JSON.stringify(action.payload));

        localStorage.setItem("accessToken", action.payload.accessToken);

        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })

      .addCase(login.rejected, (state, action) => {

          console.log(
    "LOGIN SUCCESS PAYLOAD:",
    action.payload
  );
        state.isLoading = false;

        state.isError = true;

        state.isAuthenticated = false;

        state.user = null;

        state.message = action.payload;
      })

      // GOOGLE LOGIN

      .addCase(googleAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;

        state.user = action.payload;

        localStorage.setItem("user", JSON.stringify(action.payload));

        localStorage.setItem("accessToken", action.payload.accessToken);

        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })

      // VERIFY EMAIL

      .addCase(verifyEmail.fulfilled, (state) => {
        state.isSuccess = true;
      })

      // UPDATE PROFILE

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = {
          ...state.user,

          ...action.payload,
        };

        localStorage.setItem(
          "user",

          JSON.stringify(state.user),
        );
      })

      // LOGOUT

      .addCase(logout.fulfilled, (state) => {
        state.user = null;

        state.isAuthenticated = false;

        state.isSuccess = false;

        localStorage.removeItem("user");

        localStorage.removeItem("accessToken");

        localStorage.removeItem("refreshToken");
      });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
