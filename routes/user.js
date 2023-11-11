import { Router } from "express";
import { userLogout, userSignIn, userSignUp } from "../controllers/user.js";
const router = Router();
//Create user account @public route
router.post("/signup", userSignUp);
//Login to user account @public route
router.post("/signin", userSignIn);
//Logout to user account @public route
router.get("/logout", userLogout);
export default router;
