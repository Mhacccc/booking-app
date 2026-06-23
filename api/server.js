import express from 'express'
import dotenv from 'dotenv'
import router from './routes/index.js'
import connectDatabase from './db/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT;


//middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json()); //Parse json

app.get('/', (req, res) => {
    res.status(200).send("Hello World");
})

app.use('/api', router); //Route middleware

app.use(errorHandler); //Error Handler 


app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(` 🚀 Server successfully started!`);
    console.log(` 🔗 Local URL:  \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
    console.log(` 🔗 API Base:   \x1b[36mhttp://localhost:${PORT}/api\x1b[0m`);
    console.log(`==================================================`);
    connectDatabase();
});