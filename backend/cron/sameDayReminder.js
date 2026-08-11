import cron from "node-cron";

import Appointment from "../models/Appointment.js";

import sendEmail from "../services/emailService.js";

import emailTemplate from "../templates/emailTemplate.js";

import { convertTimeToMinutes } from "../utils/convertTime.js";

// ⭐ PUSH NOTIFICATIONS (SOCKET.IO)
import { createAndSendNotification } from "../services/notificationService.js";




const REMINDER_WINDOW_MINUTES = 60;

const startSameDayReminderCron = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      // =================================
      // TODAY'S DATE RANGE
      // =================================

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      // =================================
      // FIND TODAY'S UPCOMING APPOINTMENTS
      // (not yet sent a same-day reminder)
      // =================================

      const appointments = await Appointment.find({
        appointmentDate: {
          $gte: startOfToday,
          $lte: endOfToday,
        },

        status: "confirmed",

        "payment.status": "paid",

        "notifications.sameDay.sent": false,
      })
        .populate("patient", "name email")
        .populate("doctor", "name")
        .populate("hospital", "name");

      if (appointments.length === 0) return;

      // =================================
      // CURRENT TIME, IN MINUTES SINCE MIDNIGHT
      // =================================

      const now = new Date();

      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      // =================================
      // SEND REMINDER FOR SLOTS STARTING
      // WITHIN THE REMINDER WINDOW
      // =================================

      for (const appointment of appointments) {
        const slotStartMinutes = convertTimeToMinutes(
          appointment.slot.start,
        );

        const minutesUntilStart = slotStartMinutes - nowMinutes;

        const isStartingSoon =
          minutesUntilStart >= 0 &&
          minutesUntilStart <= REMINDER_WINDOW_MINUTES;

        if (!isStartingSoon) continue;

        await sendEmail({
          to: appointment.patient.email,

          subject: "Your Appointment Starts Soon",

          html: emailTemplate({
            title: "Appointment Starting Soon",

            greeting: appointment.patient.name,

            message: `This is a reminder that your appointment starts today in about ${minutesUntilStart} minute(s).`,

            details: `
Appointment No : ${appointment.booking.appointmentNumber}<br/>

Hospital : ${appointment.hospital.name}<br/>

Doctor : ${appointment.doctor.name}<br/>

Date : ${appointment.appointmentDate.toDateString()}<br/>

Time : ${appointment.slot.start} - ${appointment.slot.end}<br/>

Token Number : ${appointment.queue.tokenNumber}<br/>

Estimated Waiting Time : ${appointment.queue.estimatedWaitingTime} minutes
`,
          }),
        });

        // =================================
        // PUSH NOTIFICATION (SOCKET.IO)
        // =================================

        try {
          await createAndSendNotification({
            user: appointment.patient._id,
            title: "Appointment Starting Soon",
            message: `Your appointment ${appointment.booking.appointmentNumber} starts in about ${minutesUntilStart} minute(s) at ${appointment.hospital.name}.`,
            type: "appointment_reminder",
            link: `/appointments/${appointment._id}`,
            relatedAppointment: appointment._id,
          });
        } catch (notifyError) {
          console.error("Same-Day Notification Error:", notifyError);
        }

        // =================================
        // UPDATE SAME-DAY REMINDER STATUS
        // =================================

        appointment.notifications.sameDay.sent = true;

        appointment.notifications.sameDay.sentAt = new Date();

        await appointment.save();

        console.log(
          `Same-day reminder sent to ${appointment.patient.email}`,
        );
      }
    } catch (error) {
      console.error("SAME DAY REMINDER CRON ERROR:", error);
    }
  });
};

export default startSameDayReminderCron;