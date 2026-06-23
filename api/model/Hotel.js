import mongoose from "mongoose";

/**
 * @typedef {Object} Hotel
 * @property {string} name - Unique hotel name
 * @property {string} type - Property classification (e.g. hotel, villa, apartment, resort)
 * @property {string} city - Location city (used for filtering/geographical searches)
 * @property {string} address - Physical address
 * @property {string} distance - Distance to downtown or key attractions
 * @property {string[]} photos - Image URLs/paths illustrating the property
 * @property {string} title - Marketing header/tagline for listing
 * @property {string} description - Detailed property description
 * @property {number} rating - Aggregate guest rating score (0 to 5)
 * @property {string[]} rooms - List of associated Room Category Document IDs (refers to 'Room' collection)
 * @property {number} cheapestPrice - Minimum nightly rate for room types in this hotel (used for sorting)
 * @property {boolean} featured - Highlights the property in homepage promotion carousels
 */

const HotelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    type:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    distance:{
        type: String,
        required: true,
    },
    photos:{
        type: [String]
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    rooms:{
        type: [String],
    },
    cheapestPrice: {
        type: Number,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    }

},{timestamps:true}) ;

export default mongoose.model("Hotel", HotelSchema);