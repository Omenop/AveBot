import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

/** 
 * @type {import("Types.d.ts").Commands}
*/
export default {
  category: "MODERATION",
  help: "</command> user",
  permissions: {
    bot: ["ModerateMembers", "BanMembers", "KickMembers"],
    user: ["BanMembers", "KickMembers"]
  },
  name: "mod",
  description: "Moderator Commands",
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "ban",
      description: "Ban a user from this guild",
      options: [
        { type: 6, name: "user", description: "Target", required: true },
        { type: 3, name: "reason", nameLocalizations: {"es-ES": "reason"}, description: "Provide a reason" }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "kick",
      description: "Kick a user from this guild",
      options: [
        { type: 6, name: "user", description: "Target", required: true },
        { type: 3, name: "reason", nameLocalizations: {"es-ES": "reason"}, description: "Provide a reason" }
      ]
    }
  ],
  
  async execute(client, interaction, langs) {
    await interaction.deferReply();
    const Subcommand = interaction.options.getSubcommand();
    const target = await interaction.guild.members.fetch(interaction.options.getUser("user").id);
    const reason = interaction.options.getString("reason") ?? "No provided";
    if (!target) {
      interaction.editReply(langs.l("commands.mod.err1"))
      return
    }

    if (Subcommand === "ban") {
      try {
        if (!target.bannable) {
          interaction.editReply(langs.l("commands.mod.err2"));
          return
        }
        await target.ban({
          reason: reason
         })
         //!needC
         const embed = new EmbedBuilder()
         .setColor(client.colors.default)
         .setTitle(langs.l("commands.mod.embed.ban"))
         .setDescription(`${langs.l("commands.mod.embed.description.one")} ${target.user.tag}(${target.user.id}) \n ${langs.l("commands.mod.embed.description.two")} ${interaction.user}\n${langs.l("commands.mod.embed.description.three")} \`${reason}\``)
         return interaction.editReply({ embeds: [embed] })
      } catch (error) {
        client.logger.error(langs.l("commands.mod.err3"), error)
        interaction.editReply(error.message)
      }
    }
    
    if (Subcommand === "kick") {
      try {
        if (!target.kickable) {
          interaction.editReply(langs.l("commands.mod.kickerr"));
          return;
        }
        await target.kick(reason);
        const embed = new EmbedBuilder()
          .setColor(client.colors.default)
          .setTitle(langs.l("commands.mod.embed.kick"))
          .setDescription(
            `${langs.l("commands.mod.embed.description.one")} ${target.user.tag}(${target.user.id}) \n ${langs.l("commands.mod.embed.description.two")} ${interaction.user}\n${langs.l("commands.mod.embed.description.three")} \`${reason}\``
          );
        return interaction.editReply({ embeds: [embed] });
      } catch (error) {
        client.logger.error(langs.l("commands.mod.err3"), error);
        interaction.editReply(error.message);
      }
    }
  }
};