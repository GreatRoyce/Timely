const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode =
    error.statusCode ||
    error.status ||
    500;

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500 &&
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message ||
          "Internal server error",
  });
};

module.exports = {
  notFound,
  errorHandler,
};