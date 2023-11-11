import expressAsyncHandler from "express-async-handler";
import Admin from "../model/Admin.js";
import bcrypt from "bcrypt";
import { logoutToken, signAccessToken, signAdminToken } from "../utils/generateToken.js";
import {
  adminSigninSchema,
  adminSignupSchema,
} from "../utils/usersValidate.js";
const adminSignUp = expressAsyncHandler(async (req, res) => {
  const { phone, name, email, password } = req.body;
  const existingAdmin = await Admin.findOne({ email });

  console.log(req.body);
  //->Admin defined validation
  if (!name || !email || !password || !phone)
    return res.status(400).json({ message: "All feilds are required" });
  //->Joi validation
  const { error, value } = adminSignupSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  //->existing Admin
  if (existingAdmin)
    return res.status(400).json({ message: "Admin already exists" });
  const savePassword = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({
    name,
    email,
    password: savePassword,
    phone,
  });
  const admin = newAdmin.save();
  if (!admin) return res.status(500).json({ message: "error creating Admin" });
  signAdminToken(admin._id, admin.email, admin.role, res);
  res.status(201).json({ message: "User created successfully" });
});

const adminSignIn = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  //->user defined validation
  if (!email || !password)
    return res.status(400).json({ message: "All feilds are required" });
  //->Joi validation
  const { error, value } = adminSigninSchema.validate(req.body);
  //->existing user
  if (!admin)
    return res.status(400).json({ message: "Wrong email or password" });
  if (error) return res.status(400).json({ message: error.message[0] });
  const decryptedPassword = await bcrypt.compare(password, admin.password);
  if (!decryptedPassword)
    return res.status(400).json({ message: "Wrong email or password" });
  signAdminToken(admin._id, admin.email, admin.role, res);
  res.json({ message: "user logged in sucessfully" });
});

const adminLogout = expressAsyncHandler(async (req, res) => {
  logoutToken(res);
  res.status(200).json({ message: "User logged out successfully" });
});

export { adminLogout, adminSignIn, adminSignUp };
