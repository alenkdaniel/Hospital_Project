

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);

  res.status(404);

  next(error);
};

export const errorHandler = (err, req, res, next) => {

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;



  if (err.name === "CastError") {
    statusCode = 404;

    message = "Resource not found";
  }



  if (err.code === 11000) {
    statusCode = 400;

    const field = Object.keys(err.keyValue)[0];

    message = `${field} already exists`;
  }



  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(err.errors)

      .map((item) => item.message)

      .join(", ");
  }



  if (err.name === "JsonWebTokenError") {
    statusCode = 401;

    message = "Invalid token";
  }



  if (err.name === "TokenExpiredError") {
    statusCode = 401;

    message = "Token expired";
  }



  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;

    message = "File size is too large";
  }

  res.status(statusCode).json({
    success: false,

    message,

    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
