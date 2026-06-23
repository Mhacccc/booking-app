import mongoose from "mongoose";

/**
 * @typedef {Object} User
 * @property {string} username - Unique username for authentication
 * @property {string} email - Unique email address for notifications and identification
 * @property {string} password - Bcrypt-hashed password (sanitize/exclude this from controller responses!)
 * @property {boolean} isAdmin - Determines administrative access privileges (RBAC)
 * @property {string} img - URL/path to the profile image
 * @property {string} country - Country of residence (useful for booking profiles)
 * @property {string} city - City of residence
 * @property {string} phone - Contact phone number
 */

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },  
    img: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);