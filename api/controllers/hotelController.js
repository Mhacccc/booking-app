import Hotel from "../model/Hotel.js"
import { createSuccess } from "../utils/success.js";

/** Get all hotels */
export const getAllHotels = async (req, res, next) => {
    try {
        const response = await Hotel.find().lean();

        res.status(200).json(createSuccess(response,"All Hotels retrieved successfully"));
    } catch(error) {
        next(error);
    }
}

/** Get a single hotel by ID */
export const getHotel = async (req, res, next) => {
    try {
        const response = await Hotel.findById(req.params.id);
        res.status(200).json(createSuccess(response,"Hotel retrieved successfully"));
        

    } catch(error) {
        next(error);
    }
}

/** Create a new hotel */
export const createHotel = async (req, res, next) => {
    try {
        const response = await Hotel.create(req.body);
        res.status(201).json(createSuccess(response,"Hotel created successfully"));
    } catch (error) {
        next(error);
    }
}

/** Update an existing hotel by ID */
export const updateHotel = async (req, res, next) => {
    try {
        const response = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(createSuccess(response,"Hotel created successfully"));
    } catch(error) {
        next(error);
    }
}

/** Delete a hotel by ID */
export const deleteHotel = async (req, res, next) => {
    try {
        const response = await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json(createSuccess(response,"Hotel deleted successfully"));
    } catch(error) {
        next(error);
    }
}

