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
  const response = await API.get("/appointments/hospital", {
    params: {
      limit: 100,
    },
  });

  return response.data;
};

// =====================================
// GET DOCTOR APPOINTMENTS
//
// Doctor Dashboard
// =====================================

const getDoctorAppointments = async () => {
  const response = await API.get("/appointments/doctor", {
    params: {
      limit: 100,
    },
  });

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
// COMPLETE CONSULTATION
//
// Doctor adds diagnosis, medicines, tests
// and remarks, appointment -> completed
// =====================================

const completeConsultation = async (id, data) => {
  const response = await API.patch(`/appointments/${id}/consultation`, data);

  return response.data;
};

// =====================================
// GET CONSULTATION HISTORY
//
// Patient
// =====================================

const getConsultationHistory = async () => {
  const response = await API.get("/appointments/my/history");

  return response.data;
};

// =====================================
// GET PATIENT HISTORY WITH THIS DOCTOR
//
// Doctor — used to show a quick summary of
// this doctor's own past consultations with
// a returning patient.
// =====================================

const getPatientHistoryWithDoctor = async (patientId, excludeAppointmentId) => {
  const response = await API.get(
    `/appointments/patient/${patientId}/history`,
    {
      params: excludeAppointmentId
        ? { excludeAppointmentId }
        : {},
    },
  );

  return response.data;
};

// =====================================
// UPLOAD CONSULTATION ATTACHMENTS
//
// Doctor
// =====================================

const uploadConsultationAttachments = async (id, formData) => {
  const response = await API.patch(
    `/appointments/${id}/attachments`,

    formData,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

// =====================================
// DELETE UNPAID APPOINTMENT
//
// Called when the patient cancels/dismisses
// the payment modal, so an abandoned booking
// doesn't linger and show up on the hospital
// / doctor's appointment list as "pending payment"
// =====================================

const deleteUnpaidAppointment = async (id) => {
  const response = await API.delete(`/appointments/${id}/unpaid`);
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

  completeConsultation,

  getConsultationHistory,

  getPatientHistoryWithDoctor,

  uploadConsultationAttachments,

  deleteUnpaidAppointment,
};

export default appointmentService;