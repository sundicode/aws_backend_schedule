import { Router } from "express";
import {
  adminLogout,
  adminProfile,
  adminSignIn,
  adminSignUp,
  adminfProfileSettings,
} from "../controllers/admin.js";
import { checkAdminAuth } from "../middlewares/checkAuth.js";
const router = Router();
//Create user account @public route
router.post("/signup", adminSignUp);
//Login to user account @public route
router.post("/signin", adminSignIn);
//Logout to user account @public route
router.get("/profile", checkAdminAuth, adminProfile);

router.patch("/profile", adminfProfileSettings);

router.get("/logout", adminLogout);
export default router;
