/**
 * Formats a standardized success response payload.
 * 
 
 * @param {any} data - The data payload to return
 * @param {string} [message="Success"] - Optional success message
 * @returns {object} The formatted success JSON response structure
 */
export const createSuccess = (data, message = "Success") => {
    const response = {
        success: true,
        message: message,
    };

    // If data is an array, automatically include the count property
    if (Array.isArray(data)) {
        response.count = data.length;
    }

    response.data = data;
    return response;
};
