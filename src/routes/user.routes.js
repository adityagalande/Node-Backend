import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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

export default router;
