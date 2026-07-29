import API from "../../api/axios";

// =====================================
// CREATE MEDICAL TEST
//
// Hospital Admin Only
// =====================================

const createMedicalTest = async (data) => {
  const response = await API.post("/medical-tests", data);

  return response.data;
};

// =====================================
// GET ALL MEDICAL TESTS
//
// Hospital Admin / Doctor
// =====================================

const getMedicalTests = async (params = {}) => {
  const response = await API.get("/medical-tests", {
    params,
  });

  return response.data;
};

// =====================================
// GET MEDICAL TEST BY ID
// =====================================

const getMedicalTestById = async (id) => {
  const response = await API.get(`/medical-tests/${id}`);

  return response.data;
};

// =====================================
// UPDATE MEDICAL TEST
//
// Hospital Admin Only
// =====================================

const updateMedicalTest = async (id, data) => {
  const response = await API.put(`/medical-tests/${id}`, data);

  return response.data;
};

// =====================================
// DELETE MEDICAL TEST
//
// Hospital Admin Only
// =====================================

const deleteMedicalTest = async (id) => {
  const response = await API.delete(`/medical-tests/${id}`);

  return response.data;
};

// =====================================
// SEARCH MEDICAL TESTS
//
// Doctor Autocomplete
// =====================================

const searchMedicalTests = async (keyword) => {
  const response = await API.get("/medical-tests/search", {
    params: {
      keyword,
    },
  });

  return response.data;
};

const medicalTestService = {
  createMedicalTest,
  getMedicalTests,
  getMedicalTestById,
  updateMedicalTest,
  deleteMedicalTest,
  searchMedicalTests,
};

export default medicalTestService;