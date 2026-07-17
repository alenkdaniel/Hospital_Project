import API from "../../api/axios";

// =====================================
// GET APPROVED HOSPITALS
// Public
// Pagination support
// =====================================

const getHospitals = async (params = {}) => {
  const response = await API.get(
    "/hospitals",

    {
      params,
    },
  );

  return response.data;
};

// =====================================
// SEARCH + FILTER HOSPITALS
//
// city
// department
// type
// emergency
// search
// =====================================

const searchHospitals = async (filters) => {
  const response = await API.get(
    "/hospitals/search",

    {
      params: filters,
    },
  );

  return response.data;
};

// =====================================
// LOCATION BASED HOSPITALS
//
// Browser Geolocation API
// =====================================

const getNearbyHospitals = async (location) => {
  const response = await API.get(
    "/hospitals/nearby",

    {
      params: {
        lat: location.lat,

        lng: location.lng,

        distance: location.distance || 10000,
      },
    },
  );

  return response.data;
};

// =====================================
// GET SINGLE HOSPITAL
// Public
// =====================================

const getHospitalById = async (id) => {
  const response = await API.get(`/hospitals/${id}`);

  return response.data;
};

// =====================================
// GET MY HOSPITAL
// Hospital Admin
// =====================================

const getMyHospital = async () => {
  const response = await API.get("/hospitals/my-hospital");

  return response.data;
};

// =====================================
// CREATE HOSPITAL
//
// multipart/form-data
// Cloudinary upload
// =====================================

const createHospital = async (hospitalData) => {
  const response = await API.post(
    "/hospitals",

    hospitalData,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

// =====================================
// UPDATE HOSPITAL
//
// Hospital Admin
// Super Admin
// =====================================

const updateHospital = async (
  id,

  hospitalData,
) => {
  const response = await API.patch(
    `/hospitals/${id}`,

    hospitalData,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

// =====================================
// DELETE HOSPITAL
//
// Soft Delete Backend
// =====================================

const deleteHospital = async (id) => {
  const response = await API.delete(`/hospitals/${id}`);

  return response.data;
};

// =====================================
// EXPORT SERVICE
// =====================================

const hospitalService = {
  getHospitals,

  searchHospitals,

  getNearbyHospitals,

  getHospitalById,

  getMyHospital,

  createHospital,

  updateHospital,

  deleteHospital,
};

export default hospitalService;
