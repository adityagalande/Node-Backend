import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

// Always use async-await and try-catch while connecting to DB, because sometime it will take time to connection

const connectDB = async () => {
  try {
    // "connectionInstance" variable stores response of connection
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n MongoDB Connected!! DB Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); //currently application runs on one of the process, so process.exit() exit process with different codes like 0,1,2,3
  }
}

export default connectDB;