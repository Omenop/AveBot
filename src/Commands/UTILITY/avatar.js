import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

/**@type {import("Types.d.ts").Commands}*/
const command = {
  category: "UTILITY",
  cooldown: 10,
  name: "avatar",
  description: "Display avatar",
  descriptionLocalizations: {
      "es-ES": "Muestra el Avatar",
      "hi": "अवतार प्रदर्शन"
  },
  permissions: {
      dm: true
  },
  options: [
      {
          type: ApplicationCommandOptionType.User,
          required: false,
          name: "user",
          nameLocalizations: {
              "es-ES": "usuario"
          },
          description: "Target to see Avatar",
          descriptionLocalizations: {
              "hi": "अवतार देखने का लक्ष्य",
              "es-ES": "Objetivo a ver el Avatar"
          }
      }
  ],

  async execute(client, interaction, langs) {
      const user = interaction.options.getUser("user") || interaction.user;
      const embed = new EmbedBuilder()
          .setColor(client.colors.default)
          .setTitle(langs.l("commands.utility.avatar.title", {
              userTag: user.tag
          }))
          .setFooter({ text: langs.l("commands.utility.avatar.requestBy", {
              userTag: interaction.user.tag
          }), iconURL: interaction.user.displayAvatarURL() })
          .setImage(user.displayAvatarURL({ size: 4096 }));

      interaction.reply({ embeds: [embed] });
  }
};

export default command;
