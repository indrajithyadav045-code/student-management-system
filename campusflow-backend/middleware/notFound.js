import { sendError } from '../utils/response.js';

/**
 * Middleware to catch 404 Not Found requests.
 */
export const notFoundHandler = (req, res, next) => {
  return sendError(
    res,
    `Route not found: [${req.method}] ${req.originalUrl}`,
    404
  );
};
