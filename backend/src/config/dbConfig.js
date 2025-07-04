import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGODB_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Database connected....");
    } catch (e) {
        console.log(e)
    }
}


export default connectDb