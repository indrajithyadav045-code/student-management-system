/**
 * Standardized API response utilities.
 * Ensures consistent JSON formatting across all REST endpoints.
 */

/**
 * Send a standardized success response.
 * @param {import('express').Response} res 
 * @param {string} message 
 * @param {any} data 
 * @param {number} statusCode 
 */
export const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
  const payload = {
    success: true,
    message
  };

  if (data !== null && data !== undefined) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

/**
 * Send a standardized error response.
 * @param {import('express').Response} res 
 * @param {string} message 
 * @param {number} statusCode 
 * @param {Array|null} errors 
 */
export const sendError = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message
  };

  if (errors && errors.length > 0) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};
