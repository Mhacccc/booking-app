import express from "express";
import { createRoom, updateRoom, updateRoomAvailability, deleteRoom, getRoom, getAllRooms } from "../controllers/roomController.js";
import { verifyToken, verifyAdmin } from "../middlewares/verify.js";

const router = express.Router();

// Get all rooms
router.get('/', getAllRooms);

// Get a single room
router.get('/:id', getRoom);

// Create a room (Admin only)
router.post('/:hotelid', verifyToken, verifyAdmin, createRoom);

// Update a room (Admin only)
router.put('/:id', verifyToken, verifyAdmin, updateRoom);

// Update room availability
router.put('/availability/:id', verifyToken, updateRoomAvailability);

// Delete a room (Admin only)
router.delete('/:id/:hotelid', verifyToken, verifyAdmin, deleteRoom);

export default router;