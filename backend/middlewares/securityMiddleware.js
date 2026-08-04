import helmet from "helmet";

import rateLimit from "express-rate-limit";

import mongoSanitize from "express-mongo-sanitize";

import hpp from "hpp";

export const helmetSecurity = helmet({
  crossOriginResourcePolicy: false,
});

// ===============================
// LOCAL REQUEST DETECTION
//
// Don't rely on NODE_ENV being set (it's
// easy to forget in .env, and nodemon
// doesn't set it automatically) — detect
// requests coming from localhost directly
// instead, so rate limiting is skipped in
// local dev with zero extra setup.
// ===============================

const isLocalRequest = (req) => {
  if (process.env.NODE_ENV === "development") return true;

  const ip = req.ip || req.connection?.remoteAddress || "";

  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.includes("127.0.0.1") ||
    ip.includes("::ffff:127.0.0.1")
  );
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  // 100 was shared across every /api/* call from one IP — a single
  // dashboard load alone fires several requests at once (hospital,
  // doctors, appointments...), so real usage blew through it fast.
  // 100 requests/15min per IP is fine for a login form, not for a
  // full app. Raised to a more realistic ceiling for genuine abuse
  // protection instead of tripping on normal browsing.

  max: 1000,

  // Skip entirely for local dev traffic (see isLocalRequest above) —
  // this still fully protects the API once it's actually deployed
  // behind a real public IP.

  skip: isLocalRequest,

  message: {
    success: false,

    message: "Too many requests, please try again later",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  skip: isLocalRequest,

  message: {
    success: false,

    message: "Too many login attempts. Try again later",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

export const sanitizeData = (req, res, next) => {
  if (req.body) {
    mongoSanitize.sanitize(req.body);
  }

  if (req.params) {
    mongoSanitize.sanitize(req.params);
  }

  next();
};

export const preventParameterPollution = hpp();

export const requestSizeLimit = (req, res, next) => {
  const size = Number(req.headers["content-length"]);

  if (size && size > 10 * 1024 * 1024) {
    return res.status(413).json({
      success: false,

      message: "Request file too large",
    });
  }

  next();
};