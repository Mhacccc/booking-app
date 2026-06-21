import { errorStatus } from "../utils/error.js";

export const errorHandler = (error, req, res, next) => {
    errorStatus(error)
    const message = error.message || "Something went wrong! Internal Server Error!";
    const status = error.status || 500;


    console.log(error.message);

    res.status(status).json({
        success: false,
        message: message,
        status: status,
        stack: error.stack
    })
}// Global Error Handler
