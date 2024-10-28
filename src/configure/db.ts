import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const url = process.env.DB_URL
    const connectDB = async () => {
    try {
        const connect = await mongoose.connect(url as string)
        if (connect) {
            console.log("Database connected successfully");

        } else {
            console.log("Failed to connect database");

        }
    } catch (error: any) {
        console.error(error.message);

    }
}

export default connectDB