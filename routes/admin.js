import { Router } from "express";
import {
  adminLogout,
  adminProfile,
  adminSignIn,
  adminSignUp,
  adminfProfileSettings,
} from "../controllers/admin.js";
import { checkAdminAuth } from "../middlewares/checkAuth.js";
import { fileUploader } from "../utils/fileUpload.js";
const router = Router();
//Create user account @public route
router.post("/signup", adminSignUp);
//Login to user account @public route
router.post("/signin", adminSignIn);
//Logout to user account @public route
router.get("/profile", checkAdminAuth, adminProfile);

router.patch(
  "/profile",
  checkAdminAuth,
  fileUploader([{ name: "image", maxCount: 1 }], "image"),
  adminfProfileSettings
);

router.get("/logout", adminLogout);
export default router;
