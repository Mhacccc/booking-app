import mongoose from "mongoose";

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
