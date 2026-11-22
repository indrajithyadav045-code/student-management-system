import { body, param, query, validationResult } from 'express-validator';
import { sendError } from '../utils/response.js';

/**
 * Middleware that inspects validationResult from express-validator.
 * Returns HTTP 400 Bad Request with all field-level validation messages.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    return sendError(
      res,
      'Validation failed. Please correct the highlighted errors.',
      400,
      formattedErrors
    );
  }
  next();
};

/**
 * Helper to validate phone number format:
 * - 10-digit standard mobile number (e.g. 9876543210)
 * - International number starting with + (e.g. +91 9876543210, +1 555-123-4567, 10-15 digits total)
 */
const isValidPhone = (value) => {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();

  if (trimmed.startsWith('+')) {
    const digitsOnly = trimmed.slice(1).replace(/[\s\-()]/g, '');
    return /^[0-9]{10,15}$/.test(digitsOnly);
  }

  const digitsOnly = trimmed.replace(/[\s\-()]/g, '');
  return /^[0-9]{10}$/.test(digitsOnly);
};

/**
 * Helper to validate Date of Birth:
 * - Must be a valid date in the past
 * - Student must be at least 15 years old
 * - Realistically under 90 years old
 */
const isValidDob = (value) => {
  if (!value) return false;
  const dobDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(dobDate.getTime())) return false;
  if (dobDate >= today) return false;

  let age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }

  return age >= 15 && age <= 90;
};

/**
 * Validation rules for Registering a new student (POST /api/students)
 */
export const studentRegistrationRules = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full Name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Full Name must be between 3 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Full Name may only contain alphabetic letters and spaces'),

  body('register_number')
    .trim()
    .notEmpty().withMessage('Register Number is required')
    .isLength({ min: 3, max: 25 }).withMessage('Register Number must be between 3 and 25 characters')
    .matches(/^[a-zA-Z0-9\-_/]+$/).withMessage('Register Number contains invalid characters')
    .toUpperCase(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email Address is required')
    .isEmail().withMessage('Please provide a valid email address (e.g. student@university.edu)')
    .isLength({ max: 150 }).withMessage('Email Address cannot exceed 150 characters')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone Number is required')
    .custom(isValidPhone).withMessage('Please provide a valid 10-digit number or international format (+country code)'),

  body('department')
    .trim()
    .notEmpty().withMessage('Department is required')
    .isLength({ max: 100 }).withMessage('Department cannot exceed 100 characters'),

  body('year_of_study')
    .trim()
    .notEmpty().withMessage('Year of Study is required')
    .isLength({ max: 30 }).withMessage('Year of Study cannot exceed 30 characters'),

  body('gender')
    .trim()
    .notEmpty().withMessage('Gender is required')
    .isLength({ max: 30 }).withMessage('Gender cannot exceed 30 characters'),

  body('dob')
    .trim()
    .notEmpty().withMessage('Date of Birth is required')
    .isISO8601().withMessage('Date of Birth must be in YYYY-MM-DD format')
    .custom(isValidDob).withMessage('Date of birth must be in the past and student must be at least 15 years old'),

  body('address')
    .trim()
    .notEmpty().withMessage('Residential Address is required')
    .isLength({ min: 8, max: 300 }).withMessage('Address must be between 8 and 300 characters')
];

/**
 * Validation rules for Updating an existing student (PUT /api/students/:id)
 */
export const studentUpdateRules = [
  param('id')
    .isInt({ min: 1 }).withMessage('Student ID must be a positive integer'),
  ...studentRegistrationRules
];

/**
 * Validation rule for fetching or deleting by Student ID (/api/students/:id)
 */
export const studentIdRule = [
  param('id')
    .isInt({ min: 1 }).withMessage('Student ID must be a valid positive integer')
];

/**
 * Validation rules for student search & filter query parameters
 */
export const studentQueryRules = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query cannot exceed 100 characters'),
  query('department')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Department filter cannot exceed 100 characters'),
  query('year_of_study')
    .optional()
    .trim()
    .isLength({ max: 30 }).withMessage('Year of study filter cannot exceed 30 characters')
];
