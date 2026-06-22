import mongoose from "mongoose";
import Booking from "../model/Booking.js";
import { createSuccess } from "../utils/success.js";
import { createError } from "../utils/error.js";

/** Create a new booking with date overlap checking */
export const createBooking = async (req, res, next) => {
    try {
        const { hotelId, roomId, roomNumbers, startDate, endDate, totalPrice } = req.body;

        if (!mongoose.Types.ObjectId.isValid(hotelId) || !mongoose.Types.ObjectId.isValid(roomId)) {
            return next(createError("Invalid Hotel ID or Room ID format", 400));
        }

        // Date Overlap Validation (Standout Feature)
        const overlappingBooking = await Booking.findOne({
            roomId,
            roomNumbers: { $in: roomNumbers },
            status: { $ne: "cancelled" },
            $or: [
                { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } }
            ]
        });

        if (overlappingBooking) {
            return next(createError("One or more selected rooms are already booked for these dates.", 400));
        }

        const newBooking = new Booking({
            userId: req.user.id,
            hotelId,
            roomId,
            roomNumbers,
            startDate,
            endDate,
            totalPrice
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(createSuccess(savedBooking, "Booking created successfully"));
    } catch (error) {
        next(error);
    }
};

/** Get bookings for the currently logged-in user */
export const getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
        res.status(200).json(createSuccess(bookings, "User bookings retrieved successfully"));
    } catch (error) {
        next(error);
    }
};

/** Get a single booking by ID (Owner or Admin only) */
export const getBooking = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(createError("Invalid Booking ID", 400));
    }

    try {
        const booking = await Booking.findById(req.params.id).lean();
        if (!booking) {
            return next(createError("Booking not found", 404));
        }

        // Verify ownership or admin privileges
        if (booking.userId !== req.user.id && !req.user.isAdmin) {
            return next(createError("Access denied. You do not have permission to view this booking.", 403));
        }

        res.status(200).json(createSuccess(booking, "Booking retrieved successfully"));
    } catch (error) {
        next(error);
    }
};

/** Get all bookings (Admin only) */
export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
        res.status(200).json(createSuccess(bookings, "All Bookings retrieved successfully"));
    } catch (error) {
        next(error);
    }
};

/** Delete/Cancel a booking (Owner or Admin only) */
export const deleteBooking = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(createError("Invalid Booking ID", 400));
    }

    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return next(createError("Booking not found", 404));
        }

        // Verify ownership or admin privileges
        if (booking.userId !== req.user.id && !req.user.isAdmin) {
            return next(createError("Access denied. You do not have permission to cancel this booking.", 403));
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json(createSuccess(null, "Booking cancelled and deleted successfully"));
    } catch (error) {
        next(error);
    }
};
