import nodemailer from "nodemailer";

// =====================================
// EMAIL TRANSPORT CONFIGURATION
// =====================================

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,

  port: Number(process.env.EMAIL_PORT),

  secure: Number(process.env.EMAIL_PORT) === 465,

  auth: {
    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Email Server Error:", error.message);
  } else {
    console.log("Email server is ready");
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    // VALIDATION

    if (!to || !subject || !html) {
      throw new Error("Email data missing");
    }

    // MAIL OPTIONS

    const mailOptions = {
      from: {
        name: process.env.EMAIL_NAME || "Hospital Booking",

        address: process.env.EMAIL_FROM,
      },

      to,

      subject,

      html,
    };

    // SEND EMAIL

    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    };
  } catch (error) {
    // This is the ONLY place email failures need to be logged —
    // every controller/cron in the app calls this same function,
    // and none of them check the return value, so `to` + `subject`
    // here is what actually tells you which email silently failed
    // and why (bad SMTP credentials, provider rejection, etc.)

    console.error(
      `EMAIL ERROR — failed to send "${subject}" to ${to}:`,
      error.message,
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

export default sendEmail;