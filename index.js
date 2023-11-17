import express from 'express'
import userRouter from './routes/userRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';
import database from './database/database.js'
import entryRoute from './routes/entryRoute.js'

dotenv.config()
database().catch(err => console.log(err.message));
const app = express();
app.use(express.json())
app.use(cors({ 
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use('/api/user' , userRouter)
app.use('/api/entry' , entryRoute)

app.listen(5000, () => {
    console.log("Server has been started successfully")
})