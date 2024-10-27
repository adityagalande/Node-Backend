// Custom error class that extends the built-in Error class in NodeJs
class apiErrors extends Error {
  constructor(
    statusCode, // HTTP status code associated with the error
    message = "Something went wrong", // Error message with a default value
    errors = [], // Optional array to hold any specific error details
    stack = "" // Optional stack trace for debugging
  ) {
    super(message); // Call the parent constructor with the error message

    // Assign properties to the error instance
    this.statusCode = statusCode; // Set the HTTP status code
    this.data = null; // Placeholder for additional data related to the error
    this.message = message; // Set the error message
    this.success = false; // Indicate that the operation was not successful
    this.errors = errors; // Store any specific error details in an array

    // Capture the stack trace if provided; otherwise, generate one automatically
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // Capture the stack trace for debugging
    }
  }
}

// Export the custom error class for use in other parts of the application
export { apiErrors };
