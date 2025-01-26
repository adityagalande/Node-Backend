// Import necessary modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Create an instance of the Express application
const app = express();

//we use "app.use" when using middleware or configuration

// Set up CORS middleware to allow cross-origin requests
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from specified origin (set in environment variable)
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Parse incoming JSON requests with a maximum body size limit (it is from form)
app.use(
  express.json({
    limit: "16kb", // Limits JSON payloads to 16KB to prevent large requests
  })
);

// Parse URL-encoded data with extended syntax and set a body size limit
app.use(
  express.urlencoded({
    extended: true, // Allows rich objects and arrays to be encoded in URL-encoded format
    limit: "16kb", // Limits URL-encoded payloads to 16KB
  })
);

// Serve static files from the "public" folder in the root directory
app.use(express.static("public")); // Used for serving temporary files or static assets

// Parse cookies attached to client requests
app.use(cookieParser()); // Enables reading/access or set cookies cookies from the client and making them available in req.cookies

// Export the app instance for use in other parts of the application
export { app };
