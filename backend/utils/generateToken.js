import jwt from "jsonwebtoken";

// ===============================
// ACCESS TOKEN
// Short life token
// ===============================

export const generateAccessToken = (id) => {
  return jwt.sign(
    { id },

    process.env.JWT_ACCESS_SECRET,

    {
      expiresIn: "15m",
    },
  );
};

// ===============================
// REFRESH TOKEN
// Long life token
// ===============================

export const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },

    process.env.JWT_REFRESH_SECRET,

    {
      expiresIn: "7d",
    },
  );
};
