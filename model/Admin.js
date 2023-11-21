import { Schema, model } from "mongoose";
const adminSchema = new Schema({
  adminname: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  phone: { type: String },
  address: { type: String },
  post: { type: String },
  image: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "admin",
  },
});

const adminModel = model("Admin", adminSchema);
export default adminModel;
