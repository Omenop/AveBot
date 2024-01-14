import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import WarningModel from "#models/warnings.js";

/**
 * @type {import("Types.d.ts").Commands}
 */
export default {
  category: "MODERATION",
  help: "</command> user",
  permissions: {
    bot: ["ModerateMembers", "BanMembers", "KickMembers"],
    user: ["BanMembers", "KickMembers"],
  },
  name: "mod",
  description: "Moderator Commands",
  descriptionLocalizations: {
    "es-ES": "Comandos de Moderador",
    "hi": "मॉडरेटर कमांड्स"
},
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "ban",
      description: "Ban a user from this guild",
      options: [
        { type: 6, name: "user", description: "Target", required: true },
        { type: 3, name: "reason", description: "Provide a reason" },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "kick",
      description: "Kick a user from this guild",
      options: [
        { type: 6, name: "user", description: "Target", required: true },
        { type: 3, name: "reason", description: "Provide a reason" },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "lock",
      description: "Lock a channel in this guild",
      options: [
        { type: 7, name: "channel", description: "Target channel", required: true },
        { type: 3, name: "reason", description: "Provide a reason" },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "unlock",
      description: "Unlock a channel in this guild",
      options: [
        { type: 7, name: "channel", description: "Target channel", required: true },
        { type: 3, name: "reason", description: "Provide a reason" },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "warn",
      description: "Warn a user in this guild",
      options: [
        { type: 6, name: "user", description: "Target", required: true },
        { type: 3, name: "reason", description: "Provide a reason" },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "clearwarns",
      description: "Clear warnings for a user in this guild",
      options: [
        { type: 6, name: "user", description: "Target", required: true },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "warnlist",
      description: "Check how many warnings a user has.",
      options: [
        { type: ApplicationCommandOptionType.User, name: "user", description: "User to check warnings for", required: true },
      ],
    },
  ],

  async execute(client, interaction, langs) {
    await interaction.deferReply();
    const Subcommand = interaction.options.getSubcommand();
    let target;
    const reason = interaction.options.getString("reason") ?? langs.l("commands.mod.reason");

    if (Subcommand === "ban") {
      try {
        target = await interaction.guild.members.fetch(interaction.options.getUser("user").id);
        if (!target) {
          interaction.followUp(langs.l("commands.mod.err1"));
          return;
        }

        if (!target.bannable) {
          interaction.followUp(langs.l("commands.mod.err2"));
          return;
        }

        await target.ban({
          reason: reason
        });

          // For edit the embed description and title use the languages module 
        const embed = new EmbedBuilder()
          .setColor(client.colors.default)
          .setTitle(langs.l("commands.mod.embed.ban"))
          .setDescription(`${langs.l("commands.mod.embed.description.one")} ${target.user.tag}(${target.user.id}) \n ${langs.l("commands.mod.embed.description.two")} ${interaction.user}\n${langs.l("commands.mod.embed.description.three")} \`${reason}\``);

        return interaction.followUp({ embeds: [embed] });
      } catch (error) {
        client.logger.error(langs.l("commands.mod.err3"), error);
        interaction.followUp(error.message);
      }
    }

    if (Subcommand === "kick") {
      try {
        target = await interaction.guild.members.fetch(interaction.options.getUser("user").id);
        if (!target) {
          interaction.followUp(langs.l("commands.mod.err1"));
          return;
        }

        if (!target.kickable) {
          interaction.followUp(langs.l("commands.mod.kickerr"));
          return;
        }

        await target.kick(reason);

          // For edit the embed description and title use the languages module 
        const embed = new EmbedBuilder()
          .setColor(client.colors.default)
          .setTitle(langs.l("commands.mod.embed.kick"))
          .setDescription(`${langs.l("commands.mod.embed.description.one")} ${target.user.tag}(${target.user.id}) \n ${langs.l("commands.mod.embed.description.two")} ${interaction.user}\n${langs.l("commands.mod.embed.description.three")} \`${reason}\``);

        return interaction.followUp({ embeds: [embed] });
      } catch (error) {
        client.logger.error(langs.l("commands.mod.err3"), error);
        interaction.followUp(error.message);
      }
    }

    if (Subcommand === "lock" || Subcommand === "unlock") {
      const targetChannel = interaction.options.getChannel("channel");
      if (!targetChannel) {
        interaction.followUp(langs.l("commands.mod.err5"));
        return;
      }

      try {
        // Update channel permissions
        await targetChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SendMessages: Subcommand === "lock" ? false : null, // Setting to null removes the override
        });

        const action = Subcommand === "lock" ? "locked" : "unlocked";
          // For edit the embed description and title use the languages module 
        const embed = new EmbedBuilder()
          .setColor(client.colors.default)
          .setTitle(`${langs.l("commands.mod.channel")} ${action}`)
          .setDescription(
            `${langs.l("commands.mod.channel")} ${targetChannel.name} (${targetChannel.id}) ${langs.l("commands.mod.has-been")} ${action}.
            ${action} ${langs.l("commands.mod.by")} ${interaction.user}\n${langs.l("commands.mod.embed.description.three")} \`${reason}\``
          );

        return interaction.followUp({ embeds: [embed] });
      } catch (error) {
        const action = Subcommand === "lock" ? "locking" : "unlocking";
        client.logger.error(`An error occurred while attempting to ${action} the channel.`, error);
        interaction.followUp(`Error: ${error.message}`);
      }
    }

    // Add warnings in the DB
    if (Subcommand === "warn") {
      target = await interaction.guild.members.fetch(interaction.options.getUser("user").id);
      if (!target) {
        return interaction.followUp(langs.l("commands.mod.err4"));
      }
    
      const reason = interaction.options.getString("reason") || langs.l("commands.mod.reason");
    
      try {
        await WarningModel.create({
          guildId: interaction.guild.id,
          userId: target.user.id,
          moderatorId: interaction.user.id,
          reason: reason,
        });
    
          // For edit the embed description and title use the languages module 
        const embed = new EmbedBuilder()
          .setColor(client.colors.default)
          .setTitle(langs.l("commands.mod.embed.warn"))
          .setDescription(`${langs.l("commands.mod.warned")} ${target.user.tag} (${target.user.id})\n${langs.l("commands.mod.embed.description.two")} ${interaction.user}\n${langs.l("commands.mod.embed.description.three")} \`${reason}\``);
    
        return interaction.followUp({ embeds: [embed] });
      } catch (error) {
        client.logger.error(langs.l("commands.mod.err3"), error);
        return interaction.followUp(`Error: ${error.message}`);
      }
    }
    

    if (Subcommand === "warnlist") {
      const user = interaction.options.getUser("user");

      try {
        // show the warnings from Db
        const warnings = await WarningModel.find({ guildId: interaction.guild.id, userId: user.id });

          // For edit the embed description and title use the languages module 
        const embed = new EmbedBuilder()
          .setColor(client.colors.default)
          .setTitle(`${user.tag}`)
          .setDescription(
            warnings.length > 0
              ? warnings.map((warning, index) => `**${index + 1}.** ${warning.reason}`).join("\n")
              : langs.l("commands.mod.404-warnings")
          );

        return interaction.followUp({ embeds: [embed] });
      } catch (error) {
        client.logger.error(langs.l("commands.mod.err3"), error);
        return interaction.followUp(`Error: ${error.message}`);
      }
    }
    if (Subcommand === "clearwarns") {
      const target = await interaction.guild.members.fetch(interaction.options.getUser("user").id);
      if (!target) {
        return interaction.followUp(langs.l("commands.mod.err4"));
      }

      try {
        // delete the warnings from DB 
        await WarningModel.deleteMany({ guildId: interaction.guild.id, userId: target.user.id });

          // For edit the embed description and title use the languages module 
        const embed = new EmbedBuilder()
          .setColor(client.colors.default)
          .setTitle(langs.l("commands.mod.embed.warn-clean"))
          .setDescription(`langs.l("commands.mod.clean-success") ${target.user.tag} (${target.user.id})\n${langs.l("commands.mod.embed.description.two")} ${interaction.user}`);

        return interaction.followUp({ embeds: [embed] });
      } catch (error) {
        client.logger.error(langs.l("commands.mod.err3"), error);
        return interaction.followUp(`Error: ${error.message}`);
      }
    }
  },
};