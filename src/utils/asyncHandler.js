// Define a higher-order function to handle asynchronous request handlers
const asyncHandler = (requestHandler) => {
  // Return a new function that wraps the original request handler
  return (req, res, next) => {
    // Wrap the request handler in a Promise to catch any errors
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); // Pass any caught errors to the next middleware
  };
};

// Export the asyncHandler for use in other parts of the application
export { asyncHandler };

// **********Another way to use it***********

// const asyncHandler = (fn) => { async() => {}};

// const asyncHandler = (fn) => async(req, res, next) => {
//   try {
//     await fn(req, res, next)
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message
//     })
//   }
// };
