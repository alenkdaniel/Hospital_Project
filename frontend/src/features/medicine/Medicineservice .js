import API from "../../api/axios";

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
  searchMedicines,
};

export default medicineService;