import { ApplicationCommandOptionType, TextChannel, EmbedBuilder } from "discord.js";

/**@type {import("Types.d.ts").Commands}*/
const command = {
  cooldown: 5,
  userPremium: false,
  guildPremium: false,
  dev: false,
  enabled: true,
  name: "nuke",
  description: "Deletes and clones a channel with the same name and topic.",
  descriptionLocalizations: {
    "es-ES": "Elimina y clona un canal con el mismo nombre y tema.",
    "hi": "एक चैनल को उसी नाम और विषय के साथ हटाता है और क्लोन करता है।"
},
  permissions: {
    default: "ManageChannels",
    user: ["ManageChannels"],
    bot: ["ManageChannels", "ManageGuild", "SendMessages"]
  },
  category: "ADMIN",
  options: [
    {
      name: "channel",
      description: "Select the channel to nuke.",
      type: ApplicationCommandOptionType.Channel,
      required: true
    }
  ],
  async execute(client, interaction, langs, data) {
    const targetChannel = interaction.options.getChannel("channel");

    if (!targetChannel || !(targetChannel instanceof TextChannel)) {
      interaction.reply({ content: langs.l("commands.admin.nuke.err1"), ephemeral: true });
      return;
    }

    const name = targetChannel.name;

    try {
      await targetChannel.delete();
      const clonedChannel = await targetChannel.clone();
      await clonedChannel.edit({ name: name });
      const embed = new EmbedBuilder()
      .setDescription(langs.l("commands.admin.nuke.text"))
      .setColor(client.colors.default);
      interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: langs.l("commands.admin.nuke.err2"), ephemeral: true });
    }
  }
};

export default command;
