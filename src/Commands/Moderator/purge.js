import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

/**
 * @type {import("Types.d.ts").Commands}
 */
export default {
  category: "MODERATION",
  help: "</command>",
  permissions: {
    bot: ["ManageMessages"],
    user: ["ManageMessages"]
  },
  name: "purge",
  description: "Purge Commands",
  descriptionLocalizations: {
    "es-ES": "Comandos de purga",
    "hi": "पर्ज कमांड्स"
  },
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "amount",
      description: "Purge a specified number of messages",
      options: [
        {
          type: ApplicationCommandOptionType.Integer,
          name: "count",
          description: "Number of messages to purge",
          required: true,
          choices: [
            { name: "1", value: 1 },
            { name: "5", value: 5 },
            { name: "10", value: 10 },
            { name: "20", value: 20 },
            { name: "50", value: 50 },
            { name: "99", value: 99 }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "link",
      description: "Purge messages containing links",
      options: [
        {
          type: ApplicationCommandOptionType.Integer,
          name: "count",
          description: "Number of messages to purge",
          required: true,
          choices: [
            { name: "1", value: 1 },
            { name: "5", value: 5 },
            { name: "10", value: 10 },
            { name: "20", value: 20 },
            { name: "50", value: 50 },
            { name: "99", value: 99 }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "user",
      description: "Purge messages from a specific user",
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "target",
          description: "User whose messages to purge",
          required: true
        },
        {
          type: ApplicationCommandOptionType.Integer,
          name: "count",
          description: "Number of messages to purge",
          required: true,
          choices: [
            { name: "1", value: 1 },
            { name: "5", value: 5 },
            { name: "10", value: 10 },
            { name: "20", value: 20 },
            { name: "50", value: 50 },
            { name: "99", value: 99 }
          ]
        }
      ]
    },
  ],

  async execute(client, interaction, langs) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();
    const count = interaction.options.getInteger("count") ?? 1;

    try {
      switch (subcommand) {
        case "amount":
          await purgeAmount(client, interaction, count);
          break;
        case "link":
          await purgeLinks(client, interaction, count);
          break;
        case "user":
          const targetUser = interaction.options.getUser("target");
          await purgeUser(client, interaction, targetUser, count);
          break;
        default:
          interaction.editReply(langs.l("commands.purge.err1"));
      }
    } catch (error) {
      client.logger.error("An error occurred during purge command execution.", error);
      interaction.editReply(`Error: ${error.message}`);
    }
  }
};

async function purgeAmount(client, interaction, count) {
  try {
    const messages = await interaction.channel.messages.fetch({ limit: count + 1 });
    await interaction.channel.bulkDelete(messages);

    const embed = new EmbedBuilder()
      .setColor(client.colors.default)
      .setTitle(langs.l("commands.purge.embed.title"))
      .setDescription(`${langs.l("commands.purge.embed.description")} ${count} ${langs.l("commands.purge.embed.message")}`);

    await interaction.followUp({ embeds: [embed] });
  } catch (error) {
    console.error("Error in purgeAmount:", error);
    await interaction.followUp(langs.l("commands.purge.err2"));
  }
}


async function purgeLinks(client, interaction, count) {
  const messages = await interaction.channel.messages.fetch({ limit: 100 });
  const linkMessages = messages.filter((msg) => msg.content.includes("http") || msg.content.includes("https"));
  const messagesToDelete = linkMessages.first(count);
  await interaction.channel.bulkDelete(messagesToDelete);
  const embed = new EmbedBuilder()
    .setColor(client.colors.default)
    .setTitle(langs.l("commands.purge.embed.title2"))
    .setDescription(`${langs.l("commands.purge.embed.description")} ${messagesToDelete.length} ${langs.l("commands.purge.embed.linkembed")}`);
  interaction.editReply({ embeds: [embed] });
}

async function purgeUser(client, interaction, targetUser, count) {
  const messages = await interaction.channel.messages.fetch({ limit: 100 });
  const userMessages = messages.filter((msg) => msg.author.id === targetUser.id);
  const messagesToDelete = userMessages.first(count);
  await interaction.channel.bulkDelete(messagesToDelete);
  const embed = new EmbedBuilder()
    .setColor(client.colors.default)
    .setTitle(langs.l("commands.purge.embed.title3"))
    .setDescription(`${langs.l("commands.purge.embed.description")} ${messagesToDelete.length} ${langs.l("commands.purge.embed.userembed")} ${targetUser.tag}`);
  interaction.editReply({ embeds: [embed] });
}
