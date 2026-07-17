import API from "../../api/axios";

const getHospitalsForAdmin = async (page = 1, status = "all") => {
  const response = await API.get(
    `/super-admin/hospitals?page=${page}&status=${status}`,
  );

  return response.data;
};

// =====================================
// APPROVE HOSPITAL
// =====================================

const approveHospital = async (id) => {
  const response = await API.put(`/super-admin/hospitals/${id}/approve`);

  return response.data;
};

// =====================================
// REJECT HOSPITAL
// =====================================

const rejectHospital = async (id) => {
  const response = await API.put(`/super-admin/hospitals/${id}/reject`);

  return response.data;
};

// =====================================
// GET ALL USERS
// =====================================

const getAllUsers = async () => {
  const response = await API.get("/super-admin/users");

  return response.data;
};

// =====================================
// BLOCK / UNBLOCK USER
// =====================================

const updateUserStatus = async (data) => {
  const response = await API.patch(
    `/super-admin/users/${data.id}/status`,

    {
      status: data.status,
    },
  );

  return response.data;
};

// =====================================
// DASHBOARD STATS
// =====================================

const getDashboardStats = async () => {
  const response = await API.get("/super-admin/stats");

  return response.data;
};

const superAdminService = {
  getHospitalsForAdmin,

  approveHospital,

  rejectHospital,

  getAllUsers,

  updateUserStatus,

  getDashboardStats,
};

export default superAdminService;
