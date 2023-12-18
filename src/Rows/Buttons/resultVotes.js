import { EmbedBuilder } from "discord.js"
import pollSchema from "#models/Polls.js";

/**@type {import("Types.d.ts").Buttons} */
export default {
  enable: true,
  name: "check_results",

  async execute(client, interaction, langs){
    const poll = await pollSchema.findOne({ message: interaction.message.id });
    if (!poll) return;

    const embed = new EmbedBuilder()
    .setColor(client.colors.default)
    .setTitle(langs.l("commands.utility.poll.result_title"))
    .setDescription(`**${poll.question}**\n\n**${langs.l("commands.utility.poll.one")}** ${poll.upvotes.length} votes\n**${langs.l("commands.utility.poll.two")}** ${poll.downvotes.length} ${langs.l("commands.utility.poll.vote")}`)

    interaction.reply({ embeds: [embed], ephemeral: true })
  }
}
