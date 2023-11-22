import { Schema, model } from "mongoose";
const userSchema = new Schema({
  username: { type: String },
  matricule: { type: String, unique: true },
  email: { type: String, unique: true },
  department: { type: String },
  password: { type: String },
  image: { type: String, default: null },
  role: {
    type: String,
    default: "user",
  },
});
const userSchemas = model("User", userSchema);
export default userSchemas;
