import User from "../model/User.js";
import { createError } from "../utils/error.js";
import { createSuccess } from "../utils/success.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req, res, next) => {


    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = {
        ...req.body,
        password: hash,
    };

    try {
        const user = await User.create(newUser);
        const { password, ...otherDetails } = user.toObject();
        res.status(201).json(createSuccess(otherDetails, "User created successfully"));

    } catch (error) {
        next(error);
    }

}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError("User not found!", 404));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError("Incorrect username and password!", 401));

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "24h" });

        const { password, isAdmin, ...otherDetails } = user.toObject();

        res.cookie("access_token", token, {
            httpOnly: true

        }).status(200).json(createSuccess(otherDetails, "User retrieved successfully"));
        
    } catch (error) {
        next(error);
    }


}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none"
        }).status(200).json(createSuccess(null, "User logged out successfully"));
    } catch (error) {
        next(error);
    }
}

