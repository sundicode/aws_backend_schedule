import { Schema, model } from "mongoose";
const adminSchema = new Schema({
  username: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  phone: { type: String, unique: true},
  role: {
    type: String,
    default: "admin",
  },
});
export default model("Admin", adminSchema);