import expressAsyncHandler from "express-async-handler";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import { logoutToken, signAccessToken } from "../utils/generateToken.js";
import { loginSchema, registerSchema } from "../utils/usersValidate.js";

const userSignUp = expressAsyncHandler(async (req, res) => {
  const { matricule, name, email, password, image } = req.body;
  console.log(matricule);
  const existingUser = await User.findOne({ matricule });
  console.log(existingUser);
  //->user defined validation
  if (!matricule || !name || !email || !password)
    return res.status(400).json({ message: "All feilds are required" });
  //->Joi validation
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message[0] });
  //->existing user
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });
  const savePassword = await bcrypt.hash(password, 10);
  const newUser = new User({ matricule, name, email, password: savePassword });
  const user = await newUser.save();
  if (!user) return res.status(500).json({ message: "error creating user" });
  signAccessToken(user._id, user.matricule, user.role, res);
  res.status(201).json({ message: "User created successfully" });
});

const userSignIn = expressAsyncHandler(async (req, res) => {
  const { matricule, password } = req.body;
  const user = await User.findOne({ matricule });
  //->user defined validation
  if (!matricule || !password)
    res.status(400).json({ message: "All feilds are required" });
  //->Joi validation
  const { error, value } = loginSchema.validate(req.body);
  console.log(value);
  //->existing user
  if (!user)
    return res.status(400).json({ message: "Wrong matricule or password" });
  if (error) return res.status(400).json({ message: error.message[0] });
  const decryptedPassword = await bcrypt.compare(password, user.password);
  if (!decryptedPassword)
    return res.status(400).json({ message: "Wrong matricule or password" });
  signAccessToken(user._id, user.matricule, user.role, res);
  res.json({ message: "user logged in sucessfully" });
});

const userLogout = expressAsyncHandler(async (req, res) => {
  logoutToken(res);
  res.status(200).json({ message: "user logged out sucessfully" });
});

export { userLogout, userSignIn, userSignUp };
