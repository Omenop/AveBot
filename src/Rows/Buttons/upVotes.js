import poolSchema from "#models/Polls.js";

/**@type {import("Types.d.ts").Buttons} */
/**@type {import("Types.d.ts").Commands}*/
export default {
  enable: true,
  name: "option_1",

  async execute(client, interaction, langs){
    const poll = await poolSchema.findOne({ message: interaction.message.id });
    if (!poll) return;

    if (poll.upvotes.includes(interaction.user.id)) {
      return interaction.reply({ content: langs.l("commands.utility.poll.already_voted"), ephemeral: true })
    }

    if (poll.downvotes.includes(interaction.user.id)) {
      poll.downvotes.splice(poll.downvotes.indexOf(interaction.user.id), 1);
    }

    poll.upvotes.push(interaction.user.id);
    await poll.save();
    await interaction.reply({ content: langs.l("commands.utility.poll.voted"), ephemeral: true });
  }
}
