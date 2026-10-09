const config = require('../config/env');

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: 'NotFound',
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  const statusCode = err.status || err.statusCode || 500;
  const response = {
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected server error occurred.'
  };

  if (err.errors) {
    response.validationErrors = err.errors;
  }

  if (config.NODE_ENV === 'development' && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler
};
