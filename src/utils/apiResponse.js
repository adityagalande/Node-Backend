// Custom response class for standardizing API responses
class apiResponse {
  constructor(
    statusCode, // HTTP status code for the response
    data, // Data to be sent in the response
    message = "Success" // Default success message
  ) {
    // Assign properties to the response instance
    this.statusCode = statusCode; // Set the HTTP status code
    this.data = data; // Attach any data returned in the response
    this.message = message; // Set a message, defaults to "Success"
    this.success = statusCode < 400; // Indicates success if status code is below 400
  }
}

// Export the custom response class for use in other parts of the application
export { apiResponse };
