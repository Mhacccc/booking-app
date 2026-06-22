import express from "express";
import { createHotel, updateHotel, getHotel, getAllHotels, deleteHotel } from "../controllers/hotelController.js";
import { verifyToken, verifyAdmin } from "../middlewares/verify.js";
const router = express.Router();

// Routes

// Get All the Hotels
router.get('/', getAllHotels)

//Get a Single Hotel
router.get('/:id', getHotel)

// Create a Hotel
router.post('/', verifyToken, verifyAdmin, createHotel)

// Update a Hotel
router.put('/:id', verifyToken, verifyAdmin, updateHotel)

// Delete a hotel
router.delete('/:id', verifyToken, verifyAdmin, deleteHotel)


export default router;