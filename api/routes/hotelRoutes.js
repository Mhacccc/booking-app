import express from "express";
import Hotel from "../model/Hotel.js";

const router = express.Router();


router.post('/', async (req, res) => {

    const hotel = new Hotel(req.body)
    try {
        const response = await hotel.save()
        res.status(200).json({ message: response })
    } catch (error) {
        res.status(400).json({ error: error })
    }
})

router.get('/', async (req, res) => {

    const response = await new Hotel.find()

    res.send

})

export default router;