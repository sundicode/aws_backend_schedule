import { Schema, model } from "mongoose";
const healthTipSchema = new Schema({
  title: String,
  body: { type: Blob },
});

const healthTipModel = model("HealthTip", healthTipSchema);
export default healthTipModel;
