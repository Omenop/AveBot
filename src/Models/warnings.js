import { Schema, model } from "mongoose";

const WarningSchema = new Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  moderatorId: { type: String, required: true },
  reason: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const WarningModel = model("Warning", WarningSchema);

export default WarningModel;
