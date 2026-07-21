import jwt from "jsonwebtoken";

import User from "../models/User.js";


export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }
// console.log("Authorization Header:", req.headers.authorization);

    const decoded = jwt.verify(
      token,

      process.env.JWT_ACCESS_SECRET,
    );

//  console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    if (user.accountStatus === "blocked") {
      return res.status(403).json({
        message: "Your account is blocked",
      });
    }

    req.user = user;

    next();
  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};



export const approvedOnly = (req, res, next) => {
  if (req.user.accountStatus !== "active") {
    return res.status(403).json({
      message: "Account waiting for approval",
    });
  }

  next();
};
