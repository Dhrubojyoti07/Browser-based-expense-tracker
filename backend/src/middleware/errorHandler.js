/**
 * Custom application error class.
 * Extends the native Error with an HTTP status code for consistent error handling.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Global error-handling middleware.
 * Returns a uniform JSON response with only { message, statusCode }.
 * No stack traces or extra fields are ever exposed.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ message, statusCode });
};

export { AppError, errorHandler };
