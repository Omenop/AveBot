import { commandHandler } from "../Handlers/Commands.js";
import RowHandler from "../Handlers/RowHandler.js";

/** @type {import("Types.d.ts").Events<"interactionCreate">} */
export default {
  name: "interactionCreate",
  async execute(client, interaction) {
    
   await RowHandler(client, interaction);
   await commandHandler(client, interaction);
  }
}