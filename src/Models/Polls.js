import mongoose from "mongoose";


const Poll = new mongoose.Schema({
  guild: String,
  channel: String,
  message: String,
  question: String,
  upvotes: [ { type: String, default: [] } ],
  downvotes: [],
});

const Model = mongoose.model("Poll", Poll);


export default Model;