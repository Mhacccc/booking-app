import mongoose from "mongoose";
import Hotel from "../model/Hotel.js"
import { createSuccess } from "../utils/success.js";
import { createError } from "../utils/error.js";

/** Get all hotels */
export const getAllHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel.find().lean();

        res.status(200).json(createSuccess(hotels, "All Hotels retrieved successfully"));
    } catch(error) {
        next(error);
    }
}

/** Get a single hotel by ID */
export const getHotel = async (req, res, next) => {
    try {

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return next(createError("Invalid ID", 400))
        }
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(createSuccess(hotel, "Hotel retrieved successfully"));


    } catch(error) {
        next(error);
    }
}

/** Create a new hotel */
export const createHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.create(req.body);
        res.status(201).json(createSuccess(hotel, "Hotel created successfully"));
    } catch (error) {
        next(error);
    }
}

/** Update an existing hotel by ID */
export const updateHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(createSuccess(hotel, "Hotel updated successfully"));
    } catch(error) {
        next(error);
    }
}

/** Delete a hotel by ID */
export const deleteHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json(createSuccess(hotel, "Hotel deleted successfully"));
    } catch(error) {
        next(error);
    }
}

