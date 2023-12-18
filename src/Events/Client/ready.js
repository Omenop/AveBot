import mongooseConnection from "../../Handlers/Mongoose.js";
import { botPrecence } from "../../Handlers/BotPresence.js";

/** @type {import("Types.d.ts").Events<"ready">} */
export default {
  once: true,
  name: "ready",
  execute: async (client) => {
    client.logger.log(`LOGGED ${client.user.tag}`);
    await mongooseConnection();
    await client.createSlash();
    botPrecence(client);
  }
}