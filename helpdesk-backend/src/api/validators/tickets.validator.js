/**
 * Ticket Validators
 * 
 * Express-validator middleware for validating ticket inputs.
 */

import { body, validationResult } from 'express-validator';

// ======================
// Validation Rules
// ======================

const titleValidation = body('title')
  .trim()
  .notEmpty().withMessage('Title is required')
  .isLength({ max: 255 }).withMessage('Title must be less than 255 characters');

const descriptionValidation = body('description')
  .trim()
  .notEmpty().withMessage('Description is required')
  .isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters');

const contactNameValidation = body('contact.name')
  .optional()
  .trim()
  .isString().withMessage('Contact name must be a string');

const contactEmailValidation = body('contact.email')
  .optional()
  .trim()
  .isEmail().withMessage('Contact email must be valid');

const contactPhoneValidation = body('contact.phone')
  .optional()
  .trim()
  .matches(/^[+]?[\d\s\-()]{7,20}$/).withMessage('Contact phone must be valid');

const statusValidation = body('status')
  .notEmpty().withMessage('Status is required')
  .isIn(['pending', 'accepted', 'resolved', 'rejected'])
  .withMessage('Status must be one of: pending, accepted, resolved, rejected');

// ======================
// Validation Middleware
// ======================

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errorCode: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: errors.array()
    });
  }
  
  next();
};

// ======================
// Exported Validators
// ======================

export const validateCreateTicket = [
  titleValidation,
  descriptionValidation,
  contactNameValidation,
  contactEmailValidation,
  contactPhoneValidation,
  validate
];

export const validateUpdateTicket = [
  body('title').optional().trim().isLength({ max: 255 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  contactNameValidation,
  contactEmailValidation,
  contactPhoneValidation,
  validate
];

export const validateUpdateStatus = [
  statusValidation,
  validate
];