import API from "../../api/axios";

// =====================================
// GET ALL DOCTORS
// Public
// =====================================

const getDoctors = async () => {
  const response = await API.get("/doctors");

  return response.data;
};

// =====================================
// GET SINGLE DOCTOR
// Public
// =====================================

const getDoctorById = async (id) => {
  const response = await API.get(`/doctors/${id}`);

  return response.data;
};

// =====================================
// GET DOCTORS BY HOSPITAL
// Public
// =====================================

const getDoctorsByHospital = async (hospitalId) => {
  const response = await API.get(`/doctors/hospital/${hospitalId}`);

  return response.data;
};

// =====================================
// GET MY DOCTORS
//
// Hospital Admin Dashboard
// Super Admin
// =====================================

const getMyDoctors = async () => {
  const response = await API.get("/doctors/my-doctors");

  return response.data;
};

// =====================================
// CREATE DOCTOR
//
// Hospital Admin
//
// Supports:
// image upload Cloudinary
// =====================================

const createDoctor = async (doctorData) => {
  const response = await API.post(
    "/doctors",

    doctorData,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

// =====================================
// UPDATE DOCTOR
//
// Hospital Admin
// Super Admin
// =====================================

const updateDoctor = async (
  id,

  doctorData,
) => {
  const response = await API.put(
    `/doctors/${id}`,

    doctorData,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

// =====================================
// DELETE DOCTOR
//
// Hospital Admin
// Super Admin
// =====================================

const deleteDoctor = async (id) => {
  const response = await API.delete(`/doctors/${id}`);

  return response.data;
};

// =====================================
// EXPORT SERVICE
// =====================================

const doctorService = {
  getDoctors,

  getDoctorById,

  getDoctorsByHospital,

  getMyDoctors,

  createDoctor,

  updateDoctor,

  deleteDoctor,
};

export default doctorService;
