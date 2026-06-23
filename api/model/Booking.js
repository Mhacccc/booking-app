import mongoose from "mongoose";

/**
 * @typedef {Object} Booking
 * @property {string} userId - Reference to the reserving guest (refers to 'User' collection)
 * @property {string} hotelId - Reference to the destination property (refers to 'Hotel' collection)
 * @property {string} roomId - Reference to the specific room category reserved (refers to 'Room' collection)
 * @property {number[]} roomNumbers - Array of reserved physical room numbers (e.g. [101, 102])
 * @property {Date} startDate - Reservation check-in date
 * @property {Date} endDate - Reservation check-out date
 * @property {number} totalPrice - Computed total price for the entire duration
 * @property {string} status - Booking states: 'pending', 'confirmed', 'cancelled'
 */

const BookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    hotelId: {
        type: String,
        required: true,
    },
    roomId: {
        type: String,
        required: true,
    },
    roomNumbers: {
        type: [Number],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: "pending" // pending, confirmed, cancelled
    }
}, { timestamps: true });

export default mongoose.model("Booking", BookingSchema);
