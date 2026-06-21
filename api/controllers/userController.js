import mongoose from "mongoose";
import User from "../model/User.js"
import { createSuccess } from "../utils/success.js";
import { createError } from "../utils/error.js";

/** Get all Users */
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().lean();

        res.status(200).json(createSuccess(users,"All Users retrieved successfully"));
    } catch(error) {
        next(error);
    }
}

/** Get a single User by ID */
export const getUser = async (req, res, next) => {
    try {
        
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return next(createError("Invalid ID",400))
        }
        const user = await User.findById(req.params.id);
        res.status(200).json(createSuccess(user,"User retrieved successfully"));
        

    } catch(error) {
        next(error);
    }
}

/** Update an existing User by ID */
export const updateUser = async (req, res, next) => {

    if(req.body.isAdmin!==undefined && !req.user.isAdmin){
        return next(createError("Access Denied. You cannot modify your admin status.", 403))
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(createSuccess(user,"User updated successfully"));
    } catch(error) {
        next(error);
    }
}

/** Delete a User by ID */
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(createSuccess(user,"User deleted successfully"));
    } catch(error) {
        next(error);
    }
}

