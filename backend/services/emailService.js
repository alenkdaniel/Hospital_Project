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
    console.error("EMAIL ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

export default sendEmail;
