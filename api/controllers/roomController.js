import mongoose from "mongoose";
import Room from "../model/Room.js";
import Hotel from "../model/Hotel.js";
import { createSuccess } from "../utils/success.js";
import { createError } from "../utils/error.js";

/** Create a new room for a specific hotel */
export const createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid;
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return next(createError("Invalid Hotel ID", 400));
    }

    try {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return next(createError("Hotel not found", 404));
        }

        const savedRoom = await Room.create(req.body);

        await Hotel.findByIdAndUpdate(hotelId, {
            $push: { rooms: savedRoom._id }
        });

        res.status(201).json(createSuccess(savedRoom, "Room created successfully"));
    } catch (error) {
        next(error);
    }
};

/** Update a room by ID */
export const updateRoom = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(createError("Invalid Room ID", 400));
    }

    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).lean();
        if (!updatedRoom) {
            return next(createError("Room not found", 404));
        }
        res.status(200).json(createSuccess(updatedRoom, "Room updated successfully"));
    } catch (error) {
        next(error);
    }
};

/** Update room availability dates */
export const updateRoomAvailability = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(createError("Invalid Room Number ID", 400));
    }

    try {
        const result = await Room.updateOne(
            { "roomNumbers._id": req.params.id },
            {
                $push: {
                    "roomNumbers.$.unavailableDates": req.body.dates
                }
            }
        );
        if (result.matchedCount === 0) {
            return next(createError("Room number not found", 404));
        }
        res.status(200).json(createSuccess(null, "Room status has been updated."));
    } catch (error) {
        next(error);
    }
};

/** Delete a room by ID and remove it from its parent hotel */
export const deleteRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid;
    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(hotelId)) {
        return next(createError("Invalid Room ID or Hotel ID", 400));
    }

    try {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return next(createError("Hotel not found", 404));
        }

        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) {
            return next(createError("Room not found", 404));
        }

        await Hotel.findByIdAndUpdate(hotelId, {
            $pull: { rooms: req.params.id }
        });

        res.status(200).json(createSuccess(null, "Room deleted successfully"));
    } catch (error) {
        next(error);
    }
};

/** Get a single room by ID */
export const getRoom = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(createError("Invalid Room ID", 400));
    }

    try {
        const room = await Room.findById(req.params.id).lean();
        if (!room) {
            return next(createError("Room not found", 404));
        }
        res.status(200).json(createSuccess(room, "Room retrieved successfully"));
    } catch (error) {
        next(error);
    }
};

/** Get all rooms */
export const getAllRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find().lean();
        res.status(200).json(createSuccess(rooms, "All Rooms retrieved successfully"));
    } catch (error) {
        next(error);
    }
};
