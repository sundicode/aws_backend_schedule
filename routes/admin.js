import { Router } from "express";
import { adminLogout, adminSignIn, adminSignUp } from "../controllers/admin.js";
const router = Router();
//Create user account @public route
router.post("/signup", adminSignUp);
//Login to user account @public route
router.post("/signin", adminSignIn);
//Logout to user account @public route
router.get("/logout", adminLogout);
export default router;
