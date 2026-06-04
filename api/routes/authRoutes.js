import express from "express";

const router = express.Router();


router.post('/register', (req, res) => {
    res.status(200).send("Hello World")
})

router.post('/login', (req, res) => {

})

export default router;