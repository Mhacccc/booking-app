/**
 * Creates a custom error object with a specific message and HTTP status code.
 * 
 * Status Code Meanings:
 * - 400 = badrequest
 * - 401 = unauthorized
 * - 403 = forbidden
 * - 404 = notfound
 * - 409 = conflict
 * - 500 = internalerror
 * 
* @param {string} message - The error message
 * @param {number} status - The HTTP status code (e.g. 404, 400)
 * @returns {Error} The created custom Error object 
 */
export const createError = (message, status) => {
    const error = new Error();
    error.status = status;
    error.message = message;
    return error;
}

/**
 * Formats standard Mongoose database errors.
 */
export const errorStatus = (error) => {
    if (error.name === "CastError" || error.name === "ValidationError") { // 
        error.status = 400
    }
    if (error.code === 11000) { // Duplicate Key, Unique Key Error, Conflict
        error.status = 409
    }

}