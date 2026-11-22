import { sendError } from '../utils/response.js';

/**
 * Centralized application error handling middleware.
 * Intercepts unhandled errors, database faults, and prevents leaking sensitive internals.
 */
export const errorHandler = (err, req, res, next) => {
  // If headers are already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // 1. MySQL Duplicate Entry Error (ER_DUP_ENTRY / 1062)
  if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
    let message = 'A duplicate record already exists.';
    if (err.message && err.message.includes('uq_students_register_number')) {
      message = 'Register number is already assigned to another student.';
    } else if (err.message && err.message.includes('uq_students_email')) {
      message = 'Email address is already registered to another student.';
    } else if (err.sqlMessage) {
      if (err.sqlMessage.toLowerCase().includes('register_number')) {
        message = 'Register number already exists.';
      } else if (err.sqlMessage.toLowerCase().includes('email')) {
        message = 'Email address already exists.';
      }
    }
    return sendError(res, message, 409);
  }

  // 2. Body Parser JSON Syntax Error (Malformed JSON payload)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 'Malformed JSON in request body.', 400);
  }

  // 3. MySQL Connection Refused / Timeout
  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('[Database Error]', err.code, err.message);
    return sendError(
      res,
      'Database connection is currently unavailable. Please verify MySQL service.',
      503
    );
  }

  // 4. Default Internal Server Error
  console.error('[Unhandled Server Error]', {
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  const clientMessage = process.env.NODE_ENV === 'development'
    ? `Internal Server Error: ${err.message}`
    : 'An unexpected internal server error occurred. Please try again later.';

  return sendError(res, clientMessage, err.statusCode || 500);
};
