import { Schema, model } from "mongoose"; 

const User = new Schema({
  _id: String,
  premium: { type: Boolean, default: false },
});

const Model = model("User", User);

/**
 * 
 * @param {import("discord.js").User} user 
 */
export  async function userSettings(user) {
  if (!user?.id) throw new Error("INVALID USER");

  let data = await Model.findById(user.id);
  if (!data) return

  return data;
}
