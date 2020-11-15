class APIError extends Error {
  constructor(message, statusCode = 500, originalError = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.originalError = originalError;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { APIError };
