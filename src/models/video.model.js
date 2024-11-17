import mongoose, { Schema } from "mongoose";
// Import the mongoose-aggregate-paginate-v2 plugin for adding pagination capabilities to aggregate queries
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; 

// Define a new schema for the `Video` model
const videoSchema = new Schema(
  {
    // Path or URL of the video file
    // This field stores the location of the video file in the file system or cloud storage
    // Required because every video must have an associated video file
    videoFile: {
      type: String, // The file path is stored as a string
      required: true, // Marked as required, ensuring this field must be provided
    },
    // Path or URL of the thumbnail image for the video
    // This provides a preview image for the video
    thumbnail: {
      type: String, // The file path or URL of the thumbnail is stored as a string
      required: true, // Marked as required, meaning each video must have a thumbnail
    },
    // Title of the video
    // Used for displaying the name or heading of the video in the UI
    title: {
      type: String, // Title is stored as a string
      required: true, // This field must always be provided
      trim: true, // Automatically removes any leading or trailing whitespace from the input
    },
    // Detailed description of the video
    // Used for providing additional information about the video content
    description: {
      type: String, // Description is stored as a string
      required: true, // Marked as mandatory
      trim: true, // Ensures no unwanted whitespace is stored
    },
    // Length of the video in seconds
    // Helps users know the duration of the video before playing it
    duration: {
      type: Number, // Duration is stored as a number (integer or float)
      required: true, // Mandatory field to indicate the video runtime
    },
    // Count of how many times the video has been viewed
    // Used for analytics and popularity ranking
    views: {
      type: Number, // The number of views is stored as a number
      default: 0, // Default value is 0 if no views are recorded yet
    },
    // Flag to indicate whether the video is published
    // If set to false, the video might still be in draft or pending approval
    isPublished: {
      type: Boolean, // Stored as a boolean value (true/false)
      default: true, // Default value is true, assuming videos are published by default
    },
    // Reference to the `User` model, representing the owner of the video
    // Used to associate the video with a specific user account
    owner: {
      type: Schema.Types.ObjectId, // ObjectId is used to store references to other documents (here, the `User` document)
      ref: "User", // Refers to the `User` model, establishing a relationship between videos and users
    },
  },
  {
    // Enables automatic creation of `createdAt` and `updatedAt` fields
    // `createdAt` stores the timestamp when the document is first created
    // `updatedAt` stores the timestamp when the document is last updated
    timestamps: true,
  }
);

// Add the mongoose-aggregate-paginate-v2 plugin to the schema
// This plugin extends the schema's aggregate methods with pagination functionality
// It helps in efficiently fetching paginated results during complex aggregate queries
videoSchema.plugin(mongooseAggregatePaginate);

// Export the `Video` model for use in other parts of the application
// The model provides an interface to interact with the `videos` collection in MongoDB
export const Video = mongoose.model("Video", videoSchema);