import express from "express";
import Hotel from "../model/Hotel.js";

const router = express.Router();


// Create a Hotel
router.post('/', async (req, res) => {

    const hotel = new Hotel(req.body)
    try {
        const response = await hotel.save()
        res.status(200).json({ message: response })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.put('/:id', async (req, res)=>{
    try{
        const response = await Hotel.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).json({response})
    }catch(error){
        res.status(500).json({error:error.message})
    }
})

router.delete('/:id', async (req, res)=> {
    try{
        const response = await Hotel.findByIdAndDelete(req.params.id)
        res.status(200).json(response)
    }catch(error){
        res.status(500).json({error:error.message})
    }
})

// Get All the Hotels
router.get('/', async (req, res) => {
    try{
        const response = await Hotel.find({}).lean();
        res.status(200).json(response);
    }catch(error){
        console.log(error.message);
        res.status(500).json({message:error.message})
    }

})

//Get a Single Hotel
router.get('/:id', async (req, res) => {
  
    try{
        const response = await Hotel.findById(req.params.id);
        res.status(200).json(response);
    }catch(error){
        console.log(error.message);
        res.status(500).json({message:error.message})
    }

})


export default router;