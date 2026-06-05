import express from "express";
import { createHotel, updateHotel, getHotel, getAllHotels, deleteHotel } from "../controllers/hotelController.js";
const router = express.Router();

// Routes

// Get All the Hotels
router.get('/', getAllHotels)

//Get a Single Hotel
router.get('/:id', getHotel)

// Create a Hotel
router.post('/',createHotel)

// Update a Hotel
router.put('/:id', updateHotel)

// Delete a hotel
router.delete('/:id', deleteHotel)


export default router;