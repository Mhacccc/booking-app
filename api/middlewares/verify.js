import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

// Step 1: Verify token and save user to req.user
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next(createError("You are not authenticated", 401));
    
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        return next();

    } catch (error) {
        error.message = "Invalid Token";
        error.status = 401;
        next(error);
    }

}

// Step 2: Check if user is owner or admin
export const verifyUser = (req, res, next) => {
    if (req.params.id === req.user.id || req.user.isAdmin) {
        next();
    } else {
        next(createError("Access denied. You do not have permission to manage this account.", 403))
    }
};

// Step 3: Check if user is admin
export const verifyAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        next(createError("Access denied. Admin privileges required.", 403))
    }
}
