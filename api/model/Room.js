import mongoose from "mongoose";

/**
 * @typedef {Object} PhysicalRoomInstance
 * @property {number} number - The physical room identifier/number (e.g. 101, 102)
 * @property {Date[]} unavailableDates - Array of calendar dates blocked for bookings (used for conflict validation)
 */

/**
 * @typedef {Object} Room
 * @property {string} title - Label for this room category (e.g., 'Deluxe King Suite')
 * @property {number} price - Nightly rate for this room type
 * @property {number} maxPeople - Maximum occupency count per room
 * @property {string} desc - Brief description of amenities and layout
 * @property {PhysicalRoomInstance[]} roomNumbers - Nested subdocuments mapping individual physical rooms of this type
 */

const RoomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    maxPeople: {
        type: Number,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    roomNumbers: [{ number: Number, unavailableDates: { type: [Date] } }]
}, { timestamps: true });

export default mongoose.model("Room", RoomSchema);
