import { Schema, model } from "mongoose";
const userInfo = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User",populate: true},
  medicalReciet: { type: String },
  schoolfeeReciet: { type: String },
  
});
const userInfoSchema = model("UserInfo", userInfo)
export default userInfoSchema;
