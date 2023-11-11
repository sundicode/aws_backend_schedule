import { Schema, model } from "mongoose";
const scheduleSchema = new Schema({
  date: { type: Date, required: true },
  time: { type: Date, required: true },
  numberOfPatients: { type: Number, required: true },
  patient: [{ type: Schema.Types.ObjectId, rel: "UserInfo" }],
});
export default model("Schedule", scheduleSchema);
