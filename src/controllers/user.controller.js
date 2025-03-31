import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js"; //this user can directly talk with mongoDB
import { uploadOnCloudinary } from "../utils/cloudinaryFileUpload.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

// // Importing asyncHandler to handle asynchronous code in Express routes.
// const registerUser = asyncHandler(async (req, res) => {
//   res.status("200").json({
//     message: "Ok",
//   });
// });

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId); //find user based on ID
    console.log("user from tokens->");
    console.log(user);
    const accessToken = user.generateAccessToken(); //generate both tokens
    const refreshToken = user.generateRefreshToken();

    //save(put) refresh token in db
    user.refreshToken = refreshToken;
    //the mongoDb save methd is present in user model obj bcoz this user geted from MongoDb itself
    await user.save({ validateBeforeSave: false }); //we have to put "validateBeforeSave" coz userModel have some fields mandatory such as password, and this can ommit that mandate

    return { accessToken, refreshToken }; //return access & refresh token to use ferther such as giving to client side
  } catch (error) {
    throw new apiErrors(
      500,
      "something went wrong! while generating access & refresh token"
    );
  }
};

// ----------------STEPS FOR REGISTER--------------------
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

// ----------------STEPS FOR LOGIN--------------------
//1.get user details from frontend.
//2.validate incoming data - "note empty", username, password etc...
//3.check if user exists in system or not by checking username.
//4.Validate password.
//5.Access & Refresh token generate
//6.Send tokens in secure cookies to client
//7.return response.

const loginUser = asyncHandler(async (req, res) => {
  //1.Get data from frontend
  const { email, username, password } = req.body; //object destructuring of username and password from request body

  //2.Check fields are not empty
  if (email == "" || username == "" || password == "") {
    // if (!email && !username && !password) {
    throw new apiErrors(400, "username or password is required");
  }

  //3.Check if user exists in DB already by checking username
  // const existingUser = await User.findOne({ username: username });
  const existingUser = await User.findOne({
    $or: [{ username: username }, { email: email }],
  }); //this or that must be present in db

  if (!existingUser) {
    throw new apiErrors(404, "user does not exists");
  }

  //4.Validate password with mongodb credentials
  const isPasswordValid = await existingUser.isPasswordCorrect(password); //the user model methods are available in the user which we get from DB, which is existingUser not User(this one is mongoose user it has methods like findOne...etc but not which we created in user model)
  if (!isPasswordValid) {
    throw new apiErrors(401, "Invalid user credentials");
  }

  //5.Access & Refresh token generate
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existingUser._id
  );
  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  ); //nigate these 2 fields from return user object

  //6.Send tokens in secure cookies to client
  const options = {
    httpOnly: true,
    secure: true, //by doing httpOnly & secure : true (no one can able to modify cookies from client-side, it only modifiable from server-side)
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged-In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //here we will have access to req.user bcoz we have added middleware "auth" in "logoutUser route", and same thing will happens for multer middleware for "req.file".
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true } //bcoz of this we will get latest response which has refresh token undefined seted in DB.
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged-out successfully"));
});

//1.take existing user's refreshToken (from req.cookies.refreshToken). We can access token through cookies if anyone is hitting this end-pont.
//2.check if token is there or not
//3.validate that token.
//4.find user in DB by using token existingRefreshToken._id
//5.Validate existing token with saved in DB before generating new
//6.by using user's "_id" generate new both refresh & access token.
//*.new refresh token in user's profile in DB (already done by "generateAccessAndRefreshToken()" method)
//7.sent back to client-side both renewed tokens.
const reNewalAccessToken = asyncHandler(async (req, res) => {
  //1.take existing user's refreshToken
  const existingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken; //if anyone is using site on mobile then we have to take token from req.body

  //2.check if token is there or not
  if (!existingRefreshToken) {
    throw new apiErrors(401, "existing token not found");
  }

  //while decoding and generating token some error will occurs, hence try/catch used
  try {
    //3.decode that token.
    const decodedRefreshToken = jwt.verify(
      existingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    //4.find user in DB by using token existingRefreshToken._id
    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new apiErrors(401, "user not found in DB / Invalid refresh token");
    }

    //5.Validate existing token with saved in DB before generating new
    if (existingRefreshToken !== user?.refreshToken) {
      //here checking existing token with token that is stored in DB
      throw new apiErrors(401, "Refresh token is expired or used");
    }

    //6.by using user's "_id" generate new both refresh & access token.
    const { newAccessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    //7.sent back to client-side both renewed tokens.
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken: newAccessToken, refreshToken: newRefreshToken },
          "Tokens renewed successfully"
        )
      );
  } catch (error) {
    throw new apiErrors(401, error?.message || "Invalid refresh token");
  }
});

export { registerUser, loginUser, logoutUser, reNewalAccessToken };
