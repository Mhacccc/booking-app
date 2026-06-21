import express from "express";
import { register, login } from "../controllers/authController.js";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verify.js"

const router = express.Router();


// Routes
router.post('/register', register)
router.post('/login', login)



export default router;