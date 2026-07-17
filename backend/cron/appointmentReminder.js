import cron from "node-cron";

import Appointment from "../models/Appointment.js";

import sendEmail from "../services/emailService.js";

import emailTemplate from "../templates/emailTemplate.js";

// =================================
// APPOINTMENT REMINDER CRON
// =================================

const startAppointmentReminderCron = () => {
  cron.schedule("0 8 * * *", async () => {
    
// =================================
// GET TOMORROW DATE
// =================================

const tomorrow = new Date();

tomorrow.setDate(tomorrow.getDate() + 1);

tomorrow.setHours(0, 0, 0, 0);

const endOfTomorrow = new Date(tomorrow);

endOfTomorrow.setHours(23, 59, 59, 999);

// =================================
// FIND TOMORROW'S APPOINTMENTS
// =================================

const appointments = await Appointment.find({
  appointmentDate: {
    $gte: tomorrow,
    $lte: endOfTomorrow,
  },

  status: "confirmed",

  "payment.status": "paid",

  "notifications.reminder.sent": false,
})
  .populate("patient", "name email")
  .populate("doctor", "name")
  .populate("hospital", "name");

console.log(
  `Found ${appointments.length} appointment(s) for reminder`
);
// =================================
// SEND REMINDER EMAIL
// =================================

for (const appointment of appointments) {
  await sendEmail({
    to: appointment.patient.email,

    subject: "Appointment Reminder",

    html: emailTemplate({
      title: "Appointment Reminder",

      greeting: appointment.patient.name,

      message:
        "This is a friendly reminder that you have an appointment tomorrow.",

      details: `
Appointment No : ${appointment.booking.appointmentNumber}<br/>

Hospital : ${appointment.hospital.name}<br/>

Doctor : ${appointment.doctor.name}<br/>

Date : ${appointment.appointmentDate.toDateString()}<br/>

Time : ${appointment.appointmentTime}<br/>

Token Number : ${appointment.queue.tokenNumber}<br/>

Estimated Waiting Time : ${appointment.queue.estimatedWaitingTime} minutes
`,
    }),
  });

  // =================================
  // UPDATE REMINDER STATUS
  // =================================

  appointment.notifications.reminder.sent = true;

  appointment.notifications.reminder.sentAt = new Date();

  await appointment.save();

  console.log(
    `Reminder sent to ${appointment.patient.email}`
  );
}
  });
};

export default startAppointmentReminderCron;