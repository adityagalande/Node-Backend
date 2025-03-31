import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  reNewalAccessToken,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  // here we have placed(injected) multer "Middleware" befor registerUser controller to take 2 images "cover image" & "avatar".
  upload.fields([
    {
      name: "avatar", //this name should be refer to frontend also
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]), //accepts multipal files
  registerUser
);

router.route("/login").post(loginUser);

//Secured routes (means user must be logged-in in the system means there must be tokens present in client-side)
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(reNewalAccessToken);

export default router;
