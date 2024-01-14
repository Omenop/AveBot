import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

/**@type {import("#root/Types.js").Commands}*/
const command = {
  category: "ADMIN",
  name: "say",
  description: "Make the bot say something.",
  descriptionLocalizations: {
    "es-ES": "Haz que el bot diga algo.",
    "hi": "बॉट से कुछ कहवाने के लिए।"
},
  permissions: {
    user: ["ManageGuild"], // User perms
    bot: ["Embedlinks"] // Bot Perms
  },
  options: [
    {
      name: "message",
      description: "The message to be said.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "channel",
      description: "The channel where the message should be sent. (Optional)",
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],
  async execute(client, interaction, langs) {
    const message = interaction.options.getString("message");
    let channel = interaction.channel;

    if (interaction.options.get("channel")) {
      channel = interaction.options.getChannel("channel");
    }

    await channel.send(message);

    const embed = new EmbedBuilder()
      .setTitle(langs.l("commands.admin.say.title"))
      .setDescription(langs.l("commands.admin.say.description", {
        channel: channel.toString(),
    }))
      .setColor(client.colors.default);

      interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

export default command;
