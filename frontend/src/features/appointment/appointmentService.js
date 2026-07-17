import API from "../../api/axios";

// =====================================
// CREATE APPOINTMENT
//
// Patient Booking
// =====================================

const createAppointment = async (appointmentData) => {
  const response = await API.post(
    "/appointments",

    appointmentData,
  );

  return response.data;
};

// =====================================
// GET MY APPOINTMENTS
//
// Patient Dashboard
// =====================================

const getMyAppointments = async () => {
  const response = await API.get("/appointments/my");

  return response.data;
};

// =====================================
// GET APPOINTMENT BY ID
// =====================================

const getAppointmentById = async (id) => {
  const response = await API.get(`/appointments/${id}`);

  return response.data;
};

// =====================================
// GET HOSPITAL APPOINTMENTS
//
// Hospital Admin Dashboard
// =====================================

const getHospitalAppointments = async () => {
  const response = await API.get("/appointments/hospital");

  return response.data;
};

// =====================================
// GET DOCTOR APPOINTMENTS
//
// Doctor Dashboard
// =====================================

const getDoctorAppointments = async () => {
  const response = await API.get("/appointments/doctor");

  return response.data;
};

// =====================================
// UPDATE APPOINTMENT STATUS
//
// confirmed
// completed
// cancelled
// =====================================

const updateAppointmentStatus = async (
  id,

  status,
) => {
  const response = await API.patch(
    `/appointments/${id}/status`,

    {
      status,
    },
  );

  return response.data;
};

// =====================================
// CANCEL APPOINTMENT
// =====================================

const cancelAppointment = async (id, reason) => {
  const response = await API.patch(`/appointments/${id}/cancel`, {
    reason,
  });

  return response.data;
};

// =====================================
// RESCHEDULE APPOINTMENT
// =====================================

const rescheduleAppointment = async (id, data) => {
  const response = await API.patch(`/appointments/${id}/reschedule`, data);

  return response.data;
};

// =====================================
// GET AVAILABLE SLOTS
// =====================================

const getAvailableSlots = async (doctorId, date) => {
  const response = await API.get(`/appointments/doctor/${doctorId}/slots`, {
    params: {
      date,
    },
  });

  return response.data;
};

// =====================================
// EXPORT SERVICE
// =====================================

const appointmentService = {
  createAppointment,

  getAppointmentById,

  getMyAppointments,

  getHospitalAppointments,

  getDoctorAppointments,

  cancelAppointment,

  rescheduleAppointment,

  updateAppointmentStatus,

  getAvailableSlots,
};

export default appointmentService;
