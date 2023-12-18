import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"

/**@type {import("#root/Types.js").Commands} */
export default {
  category: "INFORMATION",
  name: "invite",
  description: "Get invite of Bot",
  descriptionLocalizations: {
    "es-ES": "Obten la invitacion del bot"
  },
  async execute(client, interaction, langs) {
    const embed = new EmbedBuilder()
    .setColor(client.colors.default)
    .setThumbnail(client.user.displayAvatarURL({size: 512, extension: "png"}))
    .setDescription(langs.l("commands.info.invite.message"))

    /**@type {ActionRowBuilder<ButtonBuilder>} */
    const row = new ActionRowBuilder();
    row.addComponents(
      new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setURL(client.invite())
      .setEmoji(client.emoji.link)
      .setLabel(langs.l("commands.info.invite.button1")),

      new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setEmoji(client.emoji.support)
      .setLabel(langs.l("commands.info.invite.button2"))
      .setURL(client.config.SupportServer)
    )

    interaction.reply({ embeds: [embed], components: [row] })
  }
}