import { Router } from "express";
import {
  updateUserProfile,
  userLogout,
  userSignIn,
  userSignUp,
} from "../controllers/user.js";
import { fileUploader } from "../utils/fileUpload.js";
import { checkUserAuth } from "../middlewares/checkAuth.js";
const router = Router();
//Create user account @public route
router.post("/signup", userSignUp);
//Login to user account @public route
router.post("/signin", userSignIn);
//Logout to user account @public route
router.patch(
  "/profile",
  checkUserAuth,
  fileUploader([{ name: "image", maxCount: 1 }], "image"),
  updateUserProfile
);
router.get("/logout", userLogout);
export default router;
