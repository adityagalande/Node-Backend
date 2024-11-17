// Import Mongoose for MongoDB connection handling
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; // Import the database name constant

// Function to connect to MongoDB using async-await and try-catch for error handling
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB with the specified URI and database name
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    // Log a success message with the database host information
    console.log(`\n MongoDB Connected!! DB Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    // Log an error message if the connection fails
    console.error("MongoDB connection failed:", error);

    // Exit the process with status code 1 to indicate an unsuccessful connection
    process.exit(1); // Exit the current process; 1 indicates failure
  }
};

// Export the connectDB function for use in other parts of the application
export default connectDB;
