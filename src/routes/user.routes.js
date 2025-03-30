import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
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

//Secured routes
router.route("/logout").post(verifyJWT, logoutUser)


export default router;
