/**
 * Ticket Input DTOs & Validation Schemas
 * 
 * These schemas define the expected structure and validation rules
 * for ticket-related inputs.
 */

// ======================
// Constants
// ======================

export const VALID_STATUSES = ['pending', 'accepted', 'resolved', 'rejected'];

export const CONSTRAINTS = {
  title: { maxLength: 255 },
  description: { maxLength: 2000 },
  email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { pattern: /^[+]?[\d\s\-()]{7,20}$/ }
};

// ======================
// Schema Definitions
// ======================

/**
 * Schema for creating a new ticket
 * 
 * Required: title, description, contact.name, contact.email
 * Optional: contact.phone
 */
export const createTicketSchema = {
  title: {
    required: true,
    type: 'string',
    maxLength: CONSTRAINTS.title.maxLength,
    message: 'Title is required and must be max 255 characters'
  },
  description: {
    required: true,
    type: 'string',
    maxLength: CONSTRAINTS.description.maxLength,
    message: 'Description is required and must be max 2000 characters'
  },
  contact: {
    required: true,
    type: 'object',
    fields: {
      name: {
        required: true,
        type: 'string',
        message: 'Contact name is required'
      },
      email: {
        required: true,
        type: 'string',
        pattern: CONSTRAINTS.email.pattern,
        message: 'Valid email is required'
      },
      phone: {
        required: false,
        type: 'string',
        pattern: CONSTRAINTS.phone.pattern,
        message: 'Phone must be a valid format'
      }
    }
  }
};

/**
 * Schema for updating ticket information
 * 
 * All fields optional, but at least one must be provided
 * Status cannot be updated through this schema
 */
export const updateTicketSchema = {
  title: {
    required: false,
    type: 'string',
    maxLength: CONSTRAINTS.title.maxLength,
    message: 'Title must be max 255 characters'
  },
  description: {
    required: false,
    type: 'string',
    maxLength: CONSTRAINTS.description.maxLength,
    message: 'Description must be max 2000 characters'
  },
  contact: {
    required: false,
    type: 'object',
    fields: {
      name: { required: false, type: 'string' },
      email: {
        required: false,
        type: 'string',
        pattern: CONSTRAINTS.email.pattern,
        message: 'Must be a valid email'
      },
      phone: {
        required: false,
        type: 'string',
        pattern: CONSTRAINTS.phone.pattern,
        message: 'Phone must be a valid format'
      }
    }
  }
};

/**
 * Schema for updating ticket status
 * 
 * Only status field allowed
 */
export const updateStatusSchema = {
  status: {
    required: true,
    type: 'string',
    enum: VALID_STATUSES,
    message: `Status must be one of: ${VALID_STATUSES.join(', ')}`
  }
};

// ======================
// Validation Helper
// ======================

/**
 * Validate input against a schema
 * @param {object} input - Input data to validate
 * @param {object} schema - Schema to validate against
 * @returns {{ isValid: boolean, errors: array }}
 */
export const validateInput = (input, schema) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = input?.[field];

    // Check required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({ field, message: rules.message || `${field} is required` });
      continue;
    }

    // Skip further validation if not provided and not required
    if (value === undefined || value === null) continue;

    // Check type
    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push({ field, message: `${field} must be a string` });
      continue;
    }

    if (rules.type === 'object' && typeof value !== 'object') {
      errors.push({ field, message: `${field} must be an object` });
      continue;
    }

    // Check maxLength
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push({ field, message: rules.message || `${field} exceeds max length of ${rules.maxLength}` });
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push({ field, message: rules.message || `${field} format is invalid` });
    }

    // Check enum
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push({ field, message: rules.message || `${field} must be one of: ${rules.enum.join(', ')}` });
    }

    // Validate nested object fields
    if (rules.type === 'object' && rules.fields) {
      const nested = validateInput(value, rules.fields);
      if (!nested.isValid) {
        nested.errors.forEach(err => {
          errors.push({ field: `${field}.${err.field}`, message: err.message });
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ======================
// Convenience Functions
// ======================

export const validateCreateTicket = (input) => validateInput(input, createTicketSchema);
export const validateUpdateTicket = (input) => validateInput(input, updateTicketSchema);
export const validateUpdateStatus = (input) => validateInput(input, updateStatusSchema);