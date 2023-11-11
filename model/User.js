import { Schema, model } from "mongoose";
const userSchema = new Schema({
  username: { type: String },
  matricule: { type: String, unique: true },
  email: { type: String, unique: true },
  department: { type: String, unique: true },
  password: { type: String },
  role: {
    type: String,
    default: "user",
  },
});
export default model("User", userSchema);
