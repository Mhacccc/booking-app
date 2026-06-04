import express from 'express'
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'
import hotelRoutes from './hotelRoutes.js'
import roomRoutes from './roomRoutes.js'

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/hotel', hotelRoutes);
router.use('/room', roomRoutes);


export default router;