import expressAsyncHandler from "express-async-handler";
import Admin from "../model/Admin.js";
import bcrypt from "bcrypt";
import { adminLogoutToken, signAdminToken } from "../utils/generateToken.js";
import {
  adminSigninSchema,
  adminSignupSchema,
} from "../utils/usersValidate.js";
const adminSignUp = expressAsyncHandler(async (req, res) => {
  const { phone, name, email, password } = req.body;
  const existingAdmin = await Admin.findOne({ email });
  //->Admin defined validation
  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error("All feilds are required");
  }
  //->Joi validation
  const { error, value } = adminSignupSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.message);
  }
  //->existing Admin
  if (existingAdmin) {
    res.status(400);
    throw new Error("Admin already exists");
  }
  const savePassword = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({
    adminname: value.name,
    email: value.email,
    password: savePassword,
    phone: value.phone,
  });
  const admin = newAdmin.save();
  if (!admin) {
    res.status(500);
    throw new Error("error creating Admin");
  }
  signAdminToken(admin._id, admin.email, admin.role, res);
  res.status(201).json({ message: "Admin created successfully" });
});

const adminSignIn = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  //->user defined validation
  if (!email || !password) {
    res.status(400);
    throw new Error("All feilds are required");
  }
  //->Joi validation
  const { error, value } = adminSigninSchema.validate(req.body);
  //->existing user
  if (!admin) {
    res.status(400);
    throw new Error("Wrong email or password");
  }
  if (error) return res.status(400).json({ message: error.message[0] });
  const decryptedPassword = await bcrypt.compare(password, admin.password);
  if (!decryptedPassword) {
    res.status(400);
    throw new Error("Wrong email or password");
  }
  signAdminToken(admin._id, admin.email, admin.role, res);
  res.status(200).json({ message: "user logged in sucessfully" });
});

const adminLogout = expressAsyncHandler(async (req, res) => {
  adminLogoutToken(res);
  res.status(200).json({ message: "User logged out successfully" });
});

export { adminLogout, adminSignIn, adminSignUp };
