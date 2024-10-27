//dotenv is configured because the env variables must be load & available everywere as quickly as possible when application is load.
import dotenv from "dotenv"; // if you want to use import dotenv then this line of code is must in package.json ("dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js")
// require('dotenv').config({path: './env'}); //this is also way to use dotenv
import connectDB from "./db/index.js";
// Import the Express app instance from app.js
import { app } from "./app.js";

// Load environment variables from the .env file located at the specified path
dotenv.config({
  path: "./env",
});

// Define the port for the server, defaulting to 3000 if not provided in the environment
const port = process.env.PORT || 3000;

// Connect to MongoDB using the async connectDB function
// .then() and .catch() are used here to handle the asynchronous nature of connectDB
connectDB()
  .then(() => {
    // If MongoDB connection is successful, set up an error listener on the app instance
    app.on("error", (error) => {
      console.error(`Error in app listening: ${error}`);
    });

    // Start the server and listen on the specified port
    app.listen(port, () => {
      console.log(`⚙️ Server is running at port : ${port}`);
    });
  })
  .catch((error) => {
    // Log an error message if MongoDB connection fails
    console.error("MongoDB connection failed !!: " + error);
  });