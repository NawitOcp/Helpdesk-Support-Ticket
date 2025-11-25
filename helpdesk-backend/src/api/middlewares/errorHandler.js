/**
 * Error Handler Middleware
 * 
 * Catches all errors and formats them into consistent API responses.
 */

import logger from '../../config/logger.js';

/**
 * Global Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Default error response
  const response = {
    success: false,
    errorCode: err.code || 'INTERNAL_ERROR',
    message: err.message || 'An unexpected error occurred',
    details: err.details || null
  };

  // Determine status code
  let statusCode = err.statusCode || err.status || 500;

  // Handle known error codes
  if (err.code === 'VALIDATION_ERROR') statusCode = 400;
  if (err.code === 'NOT_FOUND' || err.code === 'TICKET_NOT_FOUND') statusCode = 404;
  if (err.code === 'INVALID_STATUS_TRANSITION') statusCode = 422;
  if (err.code === 'INVALID_STATUS') statusCode = 400;

  // Don't expose internal errors in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    response.message = 'Internal server error';
    response.details = null;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    errorCode: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
    details: null
  });
};