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


//middlewares
app.use(express.json())
app.use('/api', router)//route middleware


app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(` 🚀 Server successfully started!`);
    console.log(` 🔗 Local URL:  \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
    console.log(` 🔗 API Base:   \x1b[36mhttp://localhost:${PORT}/api\x1b[0m`);
    console.log(`==================================================`);
    connectDatabase();
});