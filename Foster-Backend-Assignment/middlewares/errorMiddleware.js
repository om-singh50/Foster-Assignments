const errorMiddleware = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.log(
    `[ERROR] ${req.method} ${req.originalUrl}:`,
    error.message
  );

  let statusCode = error.statusCode || 500;
  let message = "Internal server error";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Invalid data";
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists";
  }

  if (statusCode < 500) {
    message = error.message || "Request failed";
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;