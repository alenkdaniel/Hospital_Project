import API from "../../api/axios";

// =====================================
// SUBMIT A REVIEW
// One review per completed appointment,
// covering both doctor + hospital.
// =====================================

const submitReview = async (appointmentId, reviewData) => {
  const response = await API.post(`/reviews/${appointmentId}`, reviewData);
  return response.data;
};

// =====================================
// GET REVIEWS FOR A DOCTOR
// =====================================

const getDoctorReviews = async (doctorId, params = {}) => {
  const response = await API.get(`/reviews/doctor/${doctorId}`, { params });
  return response.data;
};

// =====================================
// GET REVIEWS FOR A HOSPITAL
// =====================================

const getHospitalReviews = async (hospitalId, params = {}) => {
  const response = await API.get(`/reviews/hospital/${hospitalId}`, {
    params,
  });
  return response.data;
};

// =====================================
// GET FEATURED REVIEWS (HOMEPAGE)
// =====================================

const getFeaturedReviews = async (limit = 6) => {
  const response = await API.get("/reviews/featured", { params: { limit } });
  return response.data;
};

// =====================================
// GET ALL REVIEWS (PAGINATED PAGE)
// =====================================

const getAllReviews = async (params = {}) => {
  const response = await API.get("/reviews", { params });
  return response.data;
};

const reviewService = {
  submitReview,
  getDoctorReviews,
  getHospitalReviews,
  getFeaturedReviews,
  getAllReviews,
};

export default reviewService;