// import { string } from "joi";
import moment from "moment";
import { Schema, model } from "mongoose";
const scheduleSchema = new Schema({
  date: { type: String, required: true },
  time: { type: String, required: true, unique: true },
  numberOfPatients: { type: Number, required: true },
  patient: [{ type: Schema.Types.ObjectId, ref: "UserInfo", populate: true }],
});
const userSchema = model("Schedule", scheduleSchema);
export default userSchema;
