import { User } from "../models/user.model";
import { apiErrors } from "../utils/apiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

//----------------THIS MIDDLEWARE FUNCTIONALITY WILL BE USED AT MULTIPLE PLACES TO CHECK IF USER AUTHENTICATED OR NOT----------------

//This middleware jsut verify if user is present or not
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); //here we use header also bcoz if user using site on mobile then cookies will not work

    if (!token) {
      throw new apiErrors(401, "unauthorized request");
    }

    //check whether tokens are correct or not & what it contains
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decoded token");
    console.log(decodedToken);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    console.log("user after JWT verify");
    console.log(user);

    if (!user) {
      throw new apiErrors(401, "Invalid access token");
    }

    //Add new Object in "req"
    req.user = user;
    next();
  } catch (error) {
    throw new apiErrors(401, error?.message || "Invalid access token");
  }
});
