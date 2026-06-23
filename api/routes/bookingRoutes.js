import express from "express";
import { createBooking, getUserBookings, getBooking, getAllBookings, deleteBooking, updateBookingStatus } from "../controllers/bookingController.js";
import { verifyToken, verifyAdmin } from "../middlewares/verify.js";

const router = express.Router();

// Apply verifyToken globally to all booking routes
router.use(verifyToken);

// Create a booking
router.post('/', createBooking);

// Get currently logged-in user's bookings
router.get('/mine', getUserBookings);

// Get all bookings (Admin only)
router.get('/', verifyAdmin, getAllBookings);

// Get a single booking by ID (Owner or Admin check inside controller)
router.get('/:id', getBooking);

// Update booking status (Owner or Admin checks inside controller)
router.put('/:id/status', updateBookingStatus);

// Delete/Cancel a booking (Owner or Admin check inside controller)
router.delete('/:id', deleteBooking);

export default router;
