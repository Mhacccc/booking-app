import express from "express";
import { register, login, logout, currentLoggedIn } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/verify.js";


const router = express.Router();


// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

//For testing only
//Get the current logged-in
router.get("/", verifyToken, currentLoggedIn);


export default router;