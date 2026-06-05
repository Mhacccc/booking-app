/**
 * Creates a custom error object with a specific message and HTTP status code.
 * 
 * @param {string} message - The error message
 * @param {number} status - The HTTP status code (e.g. 404, 400)
 * @returns {Error} The created custom Error object
 */
export const createError = (message, status) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
}

/**
 * Formats standard Mongoose database errors.
 */
export const status_400 = (err) => {
    if(err.name === "CastError" || err.name === "ValidationError"){
        err.status = 400
    }
}