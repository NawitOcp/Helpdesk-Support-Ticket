/**
 * Ticket Query DTO
 * 
 * Transforms and validates query parameters from HTTP requests
 * into a structured query object for the service layer.
 */

import { VALID_STATUSES } from './ticket.input.js';

// ======================
// Constants
// ======================

const VALID_SORT_FIELDS = ['status', 'createdAt', 'updatedAt'];
const VALID_SORT_ORDERS = ['asc', 'desc'];

const DEFAULTS = {
  page: 1,
  limit: 10,
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  maxLimit: 100
};

// ======================
// Query Parser
// ======================

/**
 * Parse and validate query parameters
 * @param {object} rawQuery - req.query object
 * @returns {{ query: object, errors: array }}
 */
export const parseTicketQuery = (rawQuery = {}) => {
  const errors = [];
  const query = {};

  // Parse page
  query.page = parsePositiveInt(rawQuery.page, DEFAULTS.page);
  if (rawQuery.page && query.page === DEFAULTS.page && rawQuery.page !== '1') {
    errors.push({ field: 'page', message: 'Page must be a positive integer' });
  }

  // Parse limit
  query.limit = parsePositiveInt(rawQuery.limit, DEFAULTS.limit);
  if (query.limit > DEFAULTS.maxLimit) {
    query.limit = DEFAULTS.maxLimit;
  }
  if (rawQuery.limit && query.limit === DEFAULTS.limit && rawQuery.limit !== '10') {
    errors.push({ field: 'limit', message: 'Limit must be a positive integer' });
  }

  // Parse status filter
  const statusResult = parseStatus(rawQuery.status);
  query.status = statusResult.value;
  if (statusResult.error) {
    errors.push(statusResult.error);
  }

  // Parse sortBy
  query.sortBy = parseSortBy(rawQuery.sortBy);
  if (rawQuery.sortBy && !VALID_SORT_FIELDS.includes(rawQuery.sortBy)) {
    errors.push({ 
      field: 'sortBy', 
      message: `Invalid sortBy. Must be one of: ${VALID_SORT_FIELDS.join(', ')}` 
    });
  }

  // Parse sortOrder
  query.sortOrder = parseSortOrder(rawQuery.sortOrder);
  if (rawQuery.sortOrder && !VALID_SORT_ORDERS.includes(rawQuery.sortOrder.toLowerCase())) {
    errors.push({ 
      field: 'sortOrder', 
      message: `Invalid sortOrder. Must be one of: ${VALID_SORT_ORDERS.join(', ')}` 
    });
  }

  return {
    query,
    errors,
    isValid: errors.length === 0
  };
};

// ======================
// Helper Functions
// ======================

/**
 * Parse string to positive integer with default
 */
const parsePositiveInt = (value, defaultValue) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return !isNaN(parsed) && parsed > 0 ? parsed : defaultValue;
};

/**
 * Parse status filter (supports single value, comma-separated, or array)
 * @returns {{ value: string[]|null, error: object|null }}
 */
const parseStatus = (status) => {
  if (!status) {
    return { value: null, error: null };
  }

  let statuses;

  // Handle array (multiple query params: ?status=pending&status=accepted)
  if (Array.isArray(status)) {
    statuses = status;
  } 
  // Handle comma-separated string: ?status=pending,accepted
  else if (typeof status === 'string') {
    statuses = status.split(',').map(s => s.trim().toLowerCase());
  } else {
    return { value: null, error: { field: 'status', message: 'Invalid status format' } };
  }

  // Validate each status
  const invalidStatuses = statuses.filter(s => !VALID_STATUSES.includes(s));
  
  if (invalidStatuses.length > 0) {
    return {
      value: null,
      error: {
        field: 'status',
        message: `Invalid status value(s): ${invalidStatuses.join(', ')}. Valid: ${VALID_STATUSES.join(', ')}`
      }
    };
  }

  return { value: statuses, error: null };
};

/**
 * Parse and validate sortBy field
 */
const parseSortBy = (sortBy) => {
  if (!sortBy) return DEFAULTS.sortBy;
  return VALID_SORT_FIELDS.includes(sortBy) ? sortBy : DEFAULTS.sortBy;
};

/**
 * Parse and validate sortOrder
 */
const parseSortOrder = (sortOrder) => {
  if (!sortOrder) return DEFAULTS.sortOrder;
  const normalized = sortOrder.toLowerCase();
  return VALID_SORT_ORDERS.includes(normalized) ? normalized : DEFAULTS.sortOrder;
};

// ======================
// Export Constants
// ======================

export { VALID_SORT_FIELDS, VALID_SORT_ORDERS, DEFAULTS };