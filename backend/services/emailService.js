import nodemailer from "nodemailer";

// =====================================
// EMAIL TRANSPORT CONFIGURATION
// =====================================

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,

  port: Number(process.env.EMAIL_PORT),

  secure: false,

  auth: {
    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASSWORD,
  },
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
    };
  } catch (error) {


    return {
      success: false,

      error: error.message,
    };
  }
};

export default sendEmail;
