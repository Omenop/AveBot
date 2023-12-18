
import { EmbedBuilder } from "discord.js";
import { formatTimeFromSeconds } from "taskwizard";

/**@type {import("#root/Types.js").Commands} */
const command = {
  category: "INFORMATION",
  name: "uptime",
  description : "shows uptime",
  async execute(client, interaction, langs, data) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
        .setColor(client.colors.default)
        .setDescription("```yml\n" + `${formatTimeFromSeconds(process.uptime())}` + "```")
      ]
    })
  }
}

export default command;