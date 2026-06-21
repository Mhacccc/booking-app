import express from "express";
import { updateUser, getUser, getAllUsers, deleteUser } from "../controllers/userController.js";
import { verifyToken, verifyUser, verifyAdmin } from "../middlewares/verify.js";
const router = express.Router();


// Routes
//Apply token verification globally to all user routes
router.use(verifyToken);

// Get All the Users
router.get('/',verifyAdmin, getAllUsers);

//Get a Single User
router.get('/:id', verifyUser, getUser);

// Update a User
router.put('/:id', verifyUser, updateUser);

// Delete a User
router.delete('/:id', verifyUser, deleteUser);


export default router;