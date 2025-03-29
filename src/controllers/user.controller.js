import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js"; //this user can directly talk with mongoDB
import { uploadOnCloudinary } from "../utils/cloudinaryFileUpload.js";
import { apiResponse } from "../utils/apiResponse.js";

// // Importing asyncHandler to handle asynchronous code in Express routes.
// const registerUser = asyncHandler(async (req, res) => {
//   res.status("200").json({
//     message: "Ok",
//   });
// });

// ----------------STEPS--------------------
//1.get user details from frontend
//2.validate incoming data - "note empty", email etc...
//3.if user already existes: based on username or email
//4.check for images & check for Avatar
//5.upload them to cloudinary using cloudinary utility & and take url from response
//6.create user object - create entry in DB
//7.remove password & refresh token field from DB response
//8.check for user creation response whether not null
//9.return response

const registerUser = asyncHandler(async (req, res) => {
  //----------Get user details from Frontend----------
  //use req.body if data is coming from json or form
  const { fullName, email, username, password } = req.body;
  // console.log(`email: ${email} \n username: ${username}`);

  //---------------Validation of fields---------------
  // if(fullName === ""){
  //   throw new apiErrors(400, "fullname is required")
  // } below is alternate of checking condition

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiErrors(400, "All fields are required");
  }

  // console.log(req.body);
  // if (email.contains("@") !== true) {
  //   throw new apiErrors(400, "Please enter correct email");
  // }

  // ---------------If user exists---------------
  const existedUser = await User.findOne({
    $or: [{ username }, { email }], //this check if it find username or email in DB (whichever finds first)
  });

  if (existedUser) {
    throw new apiErrors(409, "username or email exists already");
  }

  // ---------------If File exists in multer---------------
  //Multer Middleware gives files access bcoz we placed middleware in user.routes.js
  const avatarLocalPath = req.files?.avatar[0]?.path; //first property[0].path gives multer taken path
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // console.log(req.files);

  if (avatarLocalPath.trim() == "" || !avatarLocalPath) {
    throw new apiErrors(400, "Please upload Avatar image");
  }

  // ---------------Upload to Cloudinary---------------
  const avatarCloudinary = await uploadOnCloudinary(avatarLocalPath); //we get whole response make sure to take url whereever needed
  const coverImageCloudinary = await uploadOnCloudinary(coverImageLocalPath);

  // console.log("cloudinary");
  // console.log(avatarCloudinary);

  // ---------------Check file is uploaded on Cloudinary---------------
  if (!avatarCloudinary) {
    throw new apiErrors(400, "please upload Avatar file");
  }

  // ---------------Create Entry in DataBase---------------
  const user = await User.create({
    //after submiting this user details you will get response back with user details
    fullName: fullName,
    avatar: avatarCloudinary.url,
    coverImage: coverImageCloudinary?.url || "", //if url present take it otherwise put empty string
    email: email,
    username: username.toLowerCase(),
    password: password,
  });

  // ---------------remove password and refreshToken field fron DB response---------------
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //this select() method with minus sign with field name ignores those fields in response
  );

  // ---------------Check user is created or not in DB---------------
  if (!createdUser) {
    throw new apiErrors(500, "Something went wrong while creating User");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User created successfully"));
});

export { registerUser };
