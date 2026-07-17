import Appointment from "../models/Appointment.js";

// ======================================
// GENERATE APPOINTMENT NUMBER
// Example:
// APT-20260705-0001
// ======================================

export const generateAppointmentNumber = async () => {
  const today = new Date();

  const date =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");

  const count = await Appointment.countDocuments({
    createdAt: {
      $gte: new Date(today.setHours(0, 0, 0, 0)),
      $lte: new Date(today.setHours(23, 59, 59, 999)),
    },
  });

  return `APT-${date}-${String(count + 1).padStart(4, "0")}`;
};
// ======================================
// GENERATE TOKEN NUMBER
// ======================================

export const generateTokenNumber = async (
  doctorId,
  appointmentDate,
  appointmentTime,
) => {
  const latestAppointment = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    status: {
      $ne: "cancelled",
    },
  })

    .sort({
      "queue.tokenNumber": -1,
    })

    .select("queue.tokenNumber");

  if (!latestAppointment) {
    return 1;
  }

  return latestAppointment.queue.tokenNumber + 1;
};
// ======================================
// CALCULATE WAITING TIME
// ======================================

export const calculateWaitingTime = (
  tokenNumber,
  consultationDuration = 15,
) => {
  if (tokenNumber <= 1) {
    return 0;
  }

  return (tokenNumber - 1) * consultationDuration;
};
// ======================================
// GENERATE APPOINTMENT SLOTS
// ======================================

export const generateSlots = (startTime, endTime, duration = 15) => {
  const slots = [];

  const [startHour, startMinute] = startTime.split(":").map(Number);

  const [endHour, endMinute] = endTime.split(":").map(Number);

  let current = new Date();

  current.setHours(startHour, startMinute, 0, 0);

  const end = new Date();

  end.setHours(endHour, endMinute, 0, 0);

  while (current < end) {
    const slotStart = current.toTimeString().slice(0, 5);

    current.setMinutes(current.getMinutes() + duration);

    if (current > end) break;

    const slotEnd = current.toTimeString().slice(0, 5);

    slots.push({
      start: slotStart,
      end: slotEnd,
    });
  }

  return slots;
};
