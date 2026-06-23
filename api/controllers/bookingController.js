import mongoose from "mongoose";
import Booking from "../model/Booking.js";
import Hotel from "../model/Hotel.js";
import Room from "../model/Room.js";
import { createSuccess } from "../utils/success.js";
import { createError } from "../utils/error.js";

/** Create a new booking with date overlap checking */
export const createBooking = async (req, res, next) => {
    try {
        const { hotelId, roomId, roomNumbers, startDate, endDate, totalPrice } = req.body;

        if (!mongoose.Types.ObjectId.isValid(hotelId) || !mongoose.Types.ObjectId.isValid(roomId)) {
            return next(createError("Invalid Hotel ID or Room ID format", 400));
        }

        // 1. Verify that the Hotel exists
        const hotelExists = await Hotel.exists({ _id: hotelId });
        if (!hotelExists) {
            return next(createError("Hotel does not exist", 404));
        }

        // 2. Verify that the Room type exists
        const room = await Room.findById(roomId).lean();
        if (!room) {
            return next(createError("Room type does not exist", 404));
        }

        // 3. Verify that the physical room numbers actually exist under that room type
        const existingNumbers = room.roomNumbers.map(rn => rn.number);
        const allNumbersExist = roomNumbers.every(num => existingNumbers.includes(num));
        if (!allNumbersExist) {
            return next(createError("One or more room numbers do not exist under this room type", 400));
        }

        // Date Overlap Validation (Standout Feature)
        const overlappingBooking = await Booking.exists({
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

/** Update booking status (e.g., Confirm or Cancel) */
export const updateBookingStatus = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(createError("Invalid Booking ID", 400));
    }

    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return next(createError("Booking not found", 404));
        }

        const { status } = req.body;
        if (!["pending", "confirmed", "cancelled"].includes(status)) {
            return next(createError("Invalid status value", 400));
        }

        // Security check: Only Admins can confirm or set pending.
        // Guests can only cancel their own bookings.
        if (!req.user.isAdmin) {
            if (booking.userId !== req.user.id) {
                return next(createError("Access denied. You do not have permission to edit this booking.", 403));
            }
            if (status !== "cancelled") {
                return next(createError("Access denied. Only administrators can confirm bookings.", 403));
            }
        }

        booking.status = status;
        const updatedBooking = await booking.save();
        res.status(200).json(createSuccess(updatedBooking, `Booking status updated to ${status} successfully`));
    } catch (error) {
        next(error);
    }
};
