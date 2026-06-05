import { status_400 } from "../utils/error.js";

export const errorHandler = (err,req,res,next) => {
    status_400(err)
    const message = err.message || "Something went wrong! Internal Server Error!";
    const status = err.status || 500;

    console.log(err.message)
 
    res.status(status).json({
        success: false,
        message: message,
        status: status,
        stack: err.stack
    })
}// Global Error Handler
