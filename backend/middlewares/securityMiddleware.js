import helmet from "helmet";

import rateLimit from "express-rate-limit";

import mongoSanitize from "express-mongo-sanitize";

import hpp from "hpp";

export const helmetSecurity = helmet({
  crossOriginResourcePolicy: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

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
