import expressAsyncHandler from "express-async-handler";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import { signAccessToken, userLogoutToken } from "../utils/generateToken.js";
import { loginSchema, registerSchema } from "../utils/usersValidate.js";

const userSignUp = expressAsyncHandler(async (req, res) => {
  const { matricule, name, email, password, department } = req.body;
  const existingUser = await User.findOne({ matricule });
  //->user defined validation
  if (!matricule || !name || !email || !password) {
    res.status(400);
    throw new Error("All feilds are required");
  }
  //->Joi validation
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.message);
  }
  //->existing user
  if (existingUser) {
    res.status(400);
    throw new Error("Users already exists");
  }
  const savePassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    matricule: value.matricule,
    username: value.name,
    email: value.email,
    password: savePassword,
    department: value.department,
  });
  const user = await newUser.save();
  if (!user) {
    res.status(500);
    throw new Error("user creating Admin");
  }
  signAccessToken(user._id, user.matricule, user.role, res);
  res.status(201).json({ message: "User created successfully" });
});

const userSignIn = expressAsyncHandler(async (req, res) => {
  const { matricule, password } = req.body;
  //->user defined validation
  if (!matricule || !password) {
    res.status(400);
    throw new Error("All feilds are required");
  }
  //->Joi validation
  const { error, value } = loginSchema.validate(req.body);
  const user = await User.findOne({ matricule: value.matricule });
  //->existing user
  if (!user) {
    res.status(400);
    throw new Error("Wrong matricule or password");
  }
  if (error) {
    res.status(400);
    throw new Error(error.message);
  }
  const decryptedPassword = await bcrypt.compare(password, user.password);
  if (!decryptedPassword) {
    res.status(400);
    throw new Error("Wrong matricule or password");
  }

  signAccessToken(user._id, user.matricule, user.role, res);
  res.json({ message: "user logged in sucessfully" });
});

const userLogout = expressAsyncHandler(async (req, res) => {
  userLogoutToken(res);
  res.status(200).json({ message: "user logged out sucessfully" });
});

export { userLogout, userSignIn, userSignUp };
