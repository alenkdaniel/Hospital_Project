import API from "../../api/axios";

// =====================================
// CREATE MEDICINE
//
// Hospital Admin Only
// =====================================

const createMedicine = async (data) => {
  const response = await API.post("/medicines", data);

  return response.data;
};

// =====================================
// GET ALL MEDICINES
//
// Hospital Admin / Doctor
// =====================================

const getMedicines = async (params = {}) => {
  const response = await API.get("/medicines", {
    params,
  });

  return response.data;
};

// =====================================
// GET MEDICINE BY ID
// =====================================

const getMedicineById = async (id) => {
  const response = await API.get(`/medicines/${id}`);

  return response.data;
};

// =====================================
// UPDATE MEDICINE
//
// Hospital Admin Only
// =====================================

const updateMedicine = async (id, data) => {
  const response = await API.put(`/medicines/${id}`, data);

  return response.data;
};

// =====================================
// DELETE MEDICINE
//
// Hospital Admin Only
// =====================================

const deleteMedicine = async (id) => {
  const response = await API.delete(`/medicines/${id}`);

  return response.data;
};

// =====================================
// SEARCH MEDICINES
//
// Doctor Autocomplete
// =====================================

const searchMedicines = async (keyword) => {
  const response = await API.get("/medicines/search", {
    params: {
      keyword,
    },
  });

  return response.data;
};

const medicineService = {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  searchMedicines,
};

export default medicineService;