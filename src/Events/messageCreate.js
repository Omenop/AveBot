import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } from "discord.js";
import { guildSettings } from "../Models/Guild.js";
import AveLangs from "../Structures/Languages.js";

/**@type {import("Types.d.ts").Events<Events.MessageCreate>} */
const event = {
  name: Events.MessageCreate,
  once: false,
  async execute(client, message) {
    if (message.author.bot || !message.guild) return;
    const guildData = await guildSettings(message.guild);
    const langs = new AveLangs(guildData.lang);

      // check for bot mentions
   const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
   if (message.content.match(mention)) {
    const commands = await client.application.commands.fetch();
    const commandHelp = commands.find(cmd => cmd.name === 'help');

     const embed = new EmbedBuilder()
     .setColor(client.colors.default)
     .setTitle(':film_frames: | HuH. i got ping?')
     .setDescription(langs.l('bot.mention', { name: client.user.username, command: `</${commandHelp.nameLocalized ?? commandHelp.name}:${commandHelp.id}>`}));
     
     /**@type {ActionRowBuilder<ButtonBuilder>} */
     const row = new ActionRowBuilder();
     row.addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Invite Me")
        .setURL(
          "https://discord.com/api/oauth2/authorize?client_id=1102681251137200188&permissions=2147502080&scope=bot%20applications.commands"
        )
    );
 
     message.reply({embeds: [embed], components: [row] }).catch((e)=>{})
   };
  }
}

export default event;