import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import reviewService from "./reviewService";

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
  featuredReviews: [],
  doctorReviews: [],
  hospitalReviews: [],
  allReviews: [],
  page: 1,
  totalPages: 1,
  stats: null,
  specialties: [],
  isLoading: false,
  isStatsLoading: false,
  isSubmitting: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// =====================================
// SUBMIT REVIEW
// =====================================

export const submitReview = createAsyncThunk(
  "review/submit",

  async ({ appointmentId, reviewData }, thunkAPI) => {
    try {
      return await reviewService.submitReview(appointmentId, reviewData);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// GET DOCTOR REVIEWS
// =====================================

export const getDoctorReviews = createAsyncThunk(
  "review/getDoctorReviews",

  async ({ doctorId, params }, thunkAPI) => {
    try {
      return await reviewService.getDoctorReviews(doctorId, params);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// GET HOSPITAL REVIEWS
// =====================================

export const getHospitalReviews = createAsyncThunk(
  "review/getHospitalReviews",

  async ({ hospitalId, params }, thunkAPI) => {
    try {
      return await reviewService.getHospitalReviews(hospitalId, params);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// GET FEATURED REVIEWS (HOMEPAGE)
// =====================================

export const getFeaturedReviews = createAsyncThunk(
  "review/getFeatured",

  async (limit, thunkAPI) => {
    try {
      return await reviewService.getFeaturedReviews(limit);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// GET ALL REVIEWS (PAGINATED, FILTERABLE)
// =====================================

export const getAllReviews = createAsyncThunk(
  "review/getAll",

  async (params, thunkAPI) => {
    try {
      return await reviewService.getAllReviews(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// GET REVIEW STATS (SUMMARY STRIP)
// =====================================

export const getReviewStats = createAsyncThunk(
  "review/getStats",

  async (_, thunkAPI) => {
    try {
      return await reviewService.getReviewStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// TOGGLE "HELPFUL" ON A REVIEW
// =====================================

export const toggleHelpful = createAsyncThunk(
  "review/toggleHelpful",

  async (reviewId, thunkAPI) => {
    try {
      const data = await reviewService.toggleHelpful(reviewId);
      return { reviewId, ...data };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================
// SLICE
// =====================================

const reviewSlice = createSlice({
  name: "review",

  initialState,

  reducers: {
    resetReview: (state) => {
      state.isLoading = false;
      state.isSubmitting = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder
      // SUBMIT

      .addCase(submitReview.pending, (state) => {
        state.isSubmitting = true;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(submitReview.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSuccess = true;
      })

      .addCase(submitReview.rejected, (state, action) => {
        state.isSubmitting = false;
        state.isError = true;
        state.message = action.payload;
      })

      // DOCTOR REVIEWS

      .addCase(getDoctorReviews.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getDoctorReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctorReviews = action.payload.reviews;
      })

      .addCase(getDoctorReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // HOSPITAL REVIEWS

      .addCase(getHospitalReviews.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getHospitalReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospitalReviews = action.payload.reviews;
      })

      .addCase(getHospitalReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // FEATURED (HOMEPAGE)

      .addCase(getFeaturedReviews.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getFeaturedReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredReviews = action.payload.reviews;
      })

      .addCase(getFeaturedReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ALL REVIEWS (PAGINATED, FILTERABLE PAGE)

      .addCase(getAllReviews.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.isLoading = false;

        // Real pagination now (page-number based, not "load more"),
        // so each fetch replaces the current page's reviews outright.
        state.allReviews = action.payload.reviews;

        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })

      .addCase(getAllReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // STATS (SUMMARY STRIP + SPECIALTY CHIPS)

      .addCase(getReviewStats.pending, (state) => {
        state.isStatsLoading = true;
      })

      .addCase(getReviewStats.fulfilled, (state, action) => {
        state.isStatsLoading = false;
        state.stats = action.payload.stats;
        state.specialties = action.payload.specialties;
      })

      .addCase(getReviewStats.rejected, (state, action) => {
        state.isStatsLoading = false;
        state.message = action.payload;
      })

      // TOGGLE HELPFUL — update just that one review in place

      .addCase(toggleHelpful.fulfilled, (state, action) => {
        const { reviewId, helpfulCount } = action.payload;

        const review = state.allReviews.find((r) => r._id === reviewId);

        if (review) {
          review.helpfulCount = helpfulCount;
        }
      });
  },
});

export const { resetReview } = reviewSlice.actions;

export default reviewSlice.reducer;