// Import necessary modules
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the schema for the User collection
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true, // Username is mandatory
      unique: true, // Ensures usernames are unique in the database
      lowercase: true, // Converts username to lowercase for uniformity
      trim: true, // Removes leading and trailing whitespace
      index: true, // Optimizes searching on the username field
    },
    email: {
      type: String,
      required: true, // Email is mandatory
      unique: true, // Ensures no duplicate emails in the database
      lowercase: true, // Converts email to lowercase for uniformity
      trim: true, // Removes leading and trailing whitespace
      match: [
        // Regular expression to validate email format
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        // Error message when email format is invalid
        "Please fill a valid email address",
      ],
    },
    fullName: {
      type: String,
      required: true, // Full name is mandatory
      trim: true, // Removes leading and trailing whitespace
      index: true, // Optimizes searching on the fullname field
    },
    avatar: {
      type: String, // URL for the user's profile image (stored via a service like Cloudinary)
      required: true, // Avatar is mandatory
    },
    coverImage: {
      type: String, // URL for the user's cover image (optional)
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId, // References the `Video` collection (assumes another model for videos exists)
        ref: "Video", // Model name of the referenced collection
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"], // Password is mandatory with a custom error message
    },
    refreshToken: {
      type: String, // Stores a refresh token for user sessions (optional)
    },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
  }
);

// Pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
  // If the password field has not been modified, skip this middleware
  if (!this.isModified("password")) return next();

  try {
    // Hash the password with a salt factor of 10
    this.password = await bcrypt.hash(this.password, 10);
    next(); // Proceed to save the user document
  } catch (error) {
    // Pass any errors to the next middleware or save operation
    next("Failed to encrypt password: ", error);
  }
});

//METHODS: we can write (add) any number methods in our schema....
// Instance method to check if a provided password matches the stored hash
userSchema.methods.isPasswordCorrect = async function (password) {
  // Uses bcrypt to compare the plain-text password with the hashed password
  return await bcrypt.compare(password, this.password); // Returns true if passwords match, false otherwise
};

// Method to generate a short-lived access token for the user
userSchema.methods.generateAccessToken = function () {
  // jwt have sign method -> (payload, secrectKey, expiary)
  return jwt.sign(
    {
      _id: this._id, // Embed the user's ID in the token payload (get _id feom mongoDB)
      email: this.email, // Embed the user's email in the token payload
      userName: this.username, // Embed the username in the token payload
      fullName: this.fullname, // Embed the full name in the token payload
    },
    process.env.ACCESS_TOKEN_SECRET, // Use the secret key for signing (stored in environment variables)
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // Token expiry duration (e.g., "15m")
    }
  );
};

// Method to generate a long-lived refresh token for the user
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id, // Embed only the user's ID in the token payload
    },
    process.env.REFRESH_TOKEN_SECRET, // Use the secret key for signing (stored in environment variables)
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // Token expiry duration (e.g., "7d")
    }
  );
};

// Explanation of JWT Methods:
// - `generateAccessToken`: Generates a JWT meant for short-term use (e.g., authenticating API requests).
//   Includes user details like `_id`, `email`, and `username` in the payload.
//   The token is signed with a secret and expires after a short period to enhance security.
// - `generateRefreshToken`: Generates a JWT meant for long-term use (e.g., refreshing an expired access token).
//   Includes only the `_id` to keep the payload minimal.
//   The token is signed with a separate secret and has a longer expiry.

// Export the User model based on the schema
export const User = mongoose.model("User", userSchema);
