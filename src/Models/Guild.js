import { Schema, model } from "mongoose";
import config from "#root/Settings/Config.js";

const Guild = new Schema({
  _id: String,
  premium: { type: Boolean, default: false },
  prefix: { type: String, default: config.PREFIX },
  lang: { type: String, default: config.LANG },
});

const Model = model("Guild", Guild);

/**
 * 
 * @param {import("discord.js").Guild} guild 
 */
export async function guildSettings(guild) {
  if (!guild?.id) throw new Error("INVALID GUILD");

  let data = await Model.findById(guild.id).catch((e) => null);
  if (!data) {
    data = new Model({
      _id: guild.id
    });
    await data.save();
  }

  return data;
}