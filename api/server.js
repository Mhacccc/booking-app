import express from 'express'
import dotenv from 'dotenv'
import router from './routes/index.js'
import connectDatabase from './db/index.js';

dotenv.config();

const app = express();


const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.status(200).send("Hello World");
})

//route middleware
app.use('/api', router)


app.listen(PORT, () => {
    connectDatabase();
    console.log("Server running on PORT: ", PORT)
});