import { BaseInteraction } from "discord.js";
import AveBot from "#structures/BotClient.js";
import { userSettings } from "../Models/Users.js";
import { guildSettings } from "../Models/Guild.js";
import AveLangs from "../Structures/Languages.js";

/**
 * @param {AveBot} client
 * @param {BaseInteraction} interaction
 */
export default async function (client, interaction) {
  const guildData = await guildSettings(interaction.guild);
  const userData = await userSettings(interaction.user);

  const data = {
    user: userData,
    guild: guildData,
  }
  
  const langs = new AveLangs(guildData?.lang ?? "en");
  if (interaction.isButton()){
    const button = client.buttons.get(interaction.customId);
    if (!button) return;
  
    try {
     await button.execute(client, interaction,langs, data);
    } catch (error) {
      client.logger.error("ButtonError", error);
    }
  }

  else if (interaction.isAnySelectMenu()) {
    const menu = client.menus.get(interaction.customId);
    if (!menu) return;
    try {
      await menu.execute(client, interaction,langs, data);
     } catch (error) {
       client.logger.error("MenuError", error);
     }    
  }

  else if (interaction.isModalSubmit()){
    const modal = client.modals.get(interaction.customId);
    if (!modal) return;
    try {
      await modal.execute(client, interaction,langs, data);
    } catch(error) {
      client.logger.error("ModalError", error);
    }
  }
}