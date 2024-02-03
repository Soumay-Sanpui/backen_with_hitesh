import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"
import dotenv from "dotenv"
dotenv.config({path: "../../.env"})
const connectDB = async () => {
    try {
        const connectionInstance =  await mongoose.connect(`mongodb+srv://somu:somu@cluster0.1f4iwcz.mongodb.net/${DB_NAME}`)
        console.log(`DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(process.env.MONGO_URL)
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;