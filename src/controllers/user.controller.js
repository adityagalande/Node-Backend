import {asyncHandler} from "../utils/asyncHandler.js";


// Importing asyncHandler to handle asynchronous code in Express routes.
const registerUser = asyncHandler(async (req, res) => {
  // asyncHandler ensures that any errors within the async function will be properly handled by Express.
  
  // Sending a response with HTTP status 200 and a JSON message.
  // Status 200 indicates that the request was successful.
  res.status("200").json({
    // A JSON response containing a simple message.
    message: "Ok",
  });
  // The res.status(200) sets the HTTP status code of the response to 200.
  // The .json() method sends the response body in JSON format.
});

export {registerUser};

// Explanation:
// 1. The function 'registerUser' is an asynchronous function wrapped in 'asyncHandler',
//    which allows Express to handle asynchronous logic without needing explicit try/catch blocks.
// 2. 'req' (request) and 'res' (response) are standard Express objects.
//    - 'req' holds the HTTP request data (parameters, body, etc.).
//    - 'res' is used to send a response back to the client.
// 3. The status code "200" indicates that the request was successful, meaning there were no errors.
// 4. The response includes a JSON body with a "message" key, which contains the value "Ok".
//    This could be expanded to include additional user registration data or error handling logic if needed in the future.
