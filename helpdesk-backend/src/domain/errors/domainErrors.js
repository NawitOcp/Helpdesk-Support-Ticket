/**
 * Domain Errors
 * 
 * Custom error classes for domain-specific errors.
 * These errors represent business rule violations and are
 * independent of HTTP or any presentation layer concerns.
 */

// ======================
// Base Domain Error
// ======================

export class DomainError extends Error {
    constructor(message, code, details = null) {
      super(message);
      this.name = this.constructor.name;
      this.code = code;
      this.details = details;
      Error.captureStackTrace(this, this.constructor);
    }
  
    toJSON() {
      return {
        name: this.name,
        code: this.code,
        message: this.message,
        details: this.details
      };
    }
  }
  
  // ======================
  // Specific Domain Errors
  // ======================
  
  /**
   * Resource not found
   */
  export class NotFoundError extends DomainError {
    constructor(resource, identifier) {
      super(
        `${resource} with ID '${identifier}' not found`,
        'NOT_FOUND',
        { resource, identifier }
      );
    }
  }
  
  /**
   * Invalid status transition attempt
   */
  export class InvalidStatusTransitionError extends DomainError {
    constructor(currentStatus, targetStatus, allowedTransitions = []) {
      const allowed = allowedTransitions.length 
        ? allowedTransitions.join(', ') 
        : 'none (final state)';
      
      super(
        `Cannot transition from '${currentStatus}' to '${targetStatus}'. Allowed transitions: ${allowed}`,
        'INVALID_STATUS_TRANSITION',
        { currentStatus, targetStatus, allowedTransitions }
      );
    }
  }
  
  /**
   * Invalid status value
   */
  export class InvalidStatusError extends DomainError {
    constructor(status, validStatuses = []) {
      super(
        `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`,
        'INVALID_STATUS',
        { status, validStatuses }
      );
    }
  }
  
  /**
   * Validation error for domain rules
   */
  export class ValidationError extends DomainError {
    constructor(message, fields = []) {
      super(
        message,
        'VALIDATION_ERROR',
        { fields }
      );
    }
  
    static fromFields(fields) {
      const messages = fields.map(f => f.message).join('; ');
      return new ValidationError(messages, fields);
    }
  }
  
  /**
   * Operation not allowed on resource in current state
   */
  export class OperationNotAllowedError extends DomainError {
    constructor(operation, reason) {
      super(
        `Operation '${operation}' not allowed: ${reason}`,
        'OPERATION_NOT_ALLOWED',
        { operation, reason }
      );
    }
  }
  
  // ======================
  // Error Code to HTTP Status Mapping
  // ======================
  
  export const ERROR_HTTP_STATUS = Object.freeze({
    NOT_FOUND: 404,
    INVALID_STATUS_TRANSITION: 422,
    INVALID_STATUS: 400,
    VALIDATION_ERROR: 400,
    OPERATION_NOT_ALLOWED: 403
  });
  
  /**
   * Get HTTP status code for a domain error
   */
  export const getHttpStatus = (error) => {
    if (error instanceof DomainError) {
      return ERROR_HTTP_STATUS[error.code] || 500;
    }
    return 500;
  };
  
  /**
   * Check if error is a domain error
   */
  export const isDomainError = (error) => {
    return error instanceof DomainError;
  };