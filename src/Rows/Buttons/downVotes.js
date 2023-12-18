import poolSchema from "#models/Polls.js";

/**@type {import("Types.d.ts").Buttons} */
/**@type {import("Types.d.ts").Commands}*/
export default {
  enable: true,
  name: "option_2",

  async execute(client, interaction, langs){
    const poll = await poolSchema.findOne({ message: interaction.message.id });
    if (!poll) return;

    if (poll.downvotes.includes(interaction.user.id)) {
      return interaction.reply({ content: langs.l("commands.utility.poll.already_voted"), ephemeral: true })
    }

    if (poll.upvotes.includes(interaction.user.id)) {
      poll.upvotes.splice(poll.upvotes.indexOf(interaction.user.id), 1);
    }

    poll.downvotes.push(interaction.user.id);
    await poll.save();
    await interaction.reply({ content: langs.l("commands.utility.poll.voted"), ephemeral: true })
  }
}
