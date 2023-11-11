import { Schema, model } from "mongoose";
const userInfo = new Schema({
  user: { type: Schema.Types.ObjectId, rel: "User" },
  medicalReciet: { type: String },
  schoolfeeReciet: { type: String },
});
export default model("UserInfo", userInfo);
