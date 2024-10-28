import express from 'express'
import userRouter from './routes/userRoute'
import connectDB from './configure/db'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import dotenv from 'dotenv'
import { initializeSocket } from './configure/socket'
dotenv.config()
const app = express()
const port =process.env.PORT
const url = process.env.URL
connectDB()
const server =http.createServer(app)
initializeSocket(server)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
    origin: ['https://taskify-chi-seven.vercel.app','http://localhost:5173'], 
    methods: 'GET,POST,PUT,DELETE', 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true
  };
app.use(cors(corsOptions))  
app.use('/',userRouter)
server.listen(port,()=>{
    console.log(`Server started:${url}:${port}`);
    
})