import User from "../models/User.js";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

import generateOTP from "../utils/generateOTP.js";

import sendEmail from "../services/emailService.js";

import emailTemplate from "../templates/emailTemplate.js";

export const register = async (req, res) => {
  try {
    const {
      name,

      email,

      password,

      role,
    } = req.body;

    const allowedRoles = ["patient", "hospital_admin"];

    if (role && !allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Invalid registration role",
      });
    }

    const userExist = await User.findOne({
      email,
    });

    if (userExist) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,

      10,
    );

    let accountStatus = "active";

    if (role === "hospital_admin") {
      accountStatus = "pending";
    }

    // CLOUDINARY IMAGE

    const imageUrl = req.file ? req.file.path : "";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      role: role || "patient",
      accountStatus,
      authProvider: "local",

      emailVerification: {
        isVerified: false,
      },
    });

    // OTP

    const otp = generateOTP();

    // SEND EMAIL OTP

    const emailResult = await sendEmail({
      to: user.email,

      subject: "Verify Your Email",

      html: emailTemplate({
        title: "Email Verification",

        greeting: user.name,

        message: "Use this OTP to verify your account.",

        otp,
      }),
    });
    if (!emailResult.success) {
      await user.deleteOne();

      return res.status(500).json({
        message: "Failed to send verification email",
      });
    }

    const hashedOTP = await bcrypt.hash(otp, 10);

    user.emailVerification.otp = hashedOTP;

    user.emailVerification.expiresAt = Date.now() + 10 * 60 * 1000;

    await user.save();


    if(user.role === "patient"){
      const confirmUser = await sendEmail({
      to:user.email,
      subject : `Our new user`,
      html: emailTemplate({
        title: "Welcome ${user.name}",

        greeting: user.name,

        message: "This is for our  new pateint greetings",
      }),
    })
    }

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const {
      email,

      password,
    } = req.body;

    const user = await User.findOne({
      email,
    })

      .select("+password +refreshToken");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Please login with Google",
      });
    }

    const isMatch = await bcrypt.compare(
      password,

      user.password,
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.accountStatus === "blocked") {
      return res.status(403).json({
        message: "Account blocked",
      });
    }

    if (!user.emailVerification.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    const accessToken = generateAccessToken(user._id);

    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    await user.save();

    res.json({
      _id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      accountStatus: user.accountStatus,

      image: user.image,

      accessToken,

      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const {
      email,

      otp,
    } = req.body;

    const user = await User.findOne({
      email,
    })

      .select("+emailVerification.otp +emailVerification.expiresAt");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user.emailVerification.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    if (
      !user.emailVerification.expiresAt ||
      user.emailVerification.expiresAt < Date.now()
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (!user.emailVerification.otp) {
      return res.status(400).json({
        message: "No OTP found. Please request a new OTP.",
      });
    }

    const isOtpMatch = await bcrypt.compare(otp, user.emailVerification.otp);

    if (!isOtpMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.emailVerification.isVerified = true;

    user.emailVerification.otp = null;

    user.emailVerification.expiresAt = undefined;

    await user.save();

    res.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.emailVerification.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (
      user.emailVerification.expiresAt &&
      user.emailVerification.expiresAt > Date.now()
    ) {
      return res.status(429).json({
        message: "Please wait before requesting another OTP.",
      });
    }

    if (
      user.passwordReset.expiresAt &&
      user.passwordReset.expiresAt > Date.now()
    ) {
      return res.status(429).json({
        message: "Please wait before requesting another password reset OTP.",
      });
    }

    const otp = generateOTP();

    const emailResult = await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      html: emailTemplate({
        title: "Email Verification",

        greeting: user.name,

        message: "Use this OTP to verify your account.",

        otp,
      }),
    });

    if (!emailResult.success) {
      return res.status(500).json({
        message: "Failed to send OTP",
      });
    }

    const hashedOTP = await bcrypt.hash(otp, 10);

    user.emailVerification.otp = hashedOTP;

    user.emailVerification.expiresAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset OTP has been sent.",
      });
    }
    if (user.authProvider === "google") {
      return res.status(400).json({
        message: "Please login using Google.",
      });
    }

    const otp = generateOTP();

    const emailResult = await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html: emailTemplate({
        title: "Password Reset",
        greeting: user.name,
        message: "Use this OTP to reset your password.",
        otp,
      }),
    });
    if (!emailResult.success) {
      return res.status(500).json({
        message: "Failed to send reset OTP",
      });
    }

    const hashedOTP = await bcrypt.hash(otp, 10);

    user.passwordReset.otp = hashedOTP;
    user.passwordReset.expiresAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    user.passwordReset.otp = undefined;
    user.passwordReset.expiresAt = undefined;
    user.refreshToken = undefined;

    res.json({
      success: true,
      message: "Password reset OTP sent successfully.",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
      email,
    }).select("+passwordReset.otp +passwordReset.expiresAt +password");
    if (!user) {
      return res.status(400).json({
        message: "Invalid OTP or email",
      });
    }
    if (!user.passwordReset.otp) {
      return res.status(400).json({
        message: "No reset OTP found.",
      });
    }
    if (
      !user.passwordReset.expiresAt ||
      user.passwordReset.expiresAt < Date.now()
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }
    const isOtpMatch = await bcrypt.compare(otp, user.passwordReset.otp);

    if (!isOtpMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.passwordReset.otp = undefined;
    user.passwordReset.expiresAt = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const {
      name,

      email,

      image,

      role,
    } = req.body;

    let user = await User.findOne({
      email,
    })

      .select("+refreshToken");

    if (!user) {
      user = await User.create({
        name,

        email,

        image,

        role: role || "patient",

        authProvider: "google",

        emailVerification: {
          isVerified: true,
        },
      });
    }

    const accessToken = generateAccessToken(user._id);

    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    await user.save();

    res.json({
      _id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      accountStatus: user.accountStatus,

      image: user.image,

      accessToken,

      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;

    if (req.file) {
      user.image = req.file.path;
    }

    await user.save();

    res.json({
      _id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      image: user.image,

      accountStatus: user.accountStatus,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(
      refreshToken,

      process.env.JWT_REFRESH_SECRET,
    );

    const user = await User.findById(decoded.id)

      .select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        message: "Invalid token",
      });
    }

    res.json({
      accessToken: generateAccessToken(user._id),
    });
  } catch (error) {
    res.status(401).json({
      message: "Token expired",
    });
  }
};

// =============================
// LOGOUT
// =============================

export const logout = async (req, res) => {
  const user = await User.findById(req.user._id)

    .select("+refreshToken");

  user.refreshToken = null;

  await user.save();

  res.json({
    message: "Logout successful",
  });
};


// =================================
// DOCTOR SET PASSWORD
// =================================

export const setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      "passwordSetup.token": token,
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid setup link",
      });
    }

    if (user.passwordSetup.completed) {
      return res.status(400).json({
        message: "Password already set",
      });
    }

    if (user.passwordSetup.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Setup link has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.passwordSetup.completed = true;

    user.passwordSetup.token = undefined;

    user.passwordSetup.expiresAt = undefined;

    await user.save();

    res.json({
      message: "Password created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
