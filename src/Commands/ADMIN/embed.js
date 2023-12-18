import { ApplicationCommandOptionType, ChannelType, EmbedBuilder, TextChannel } from "discord.js";
import { isHex, discordColors } from "taskwizard";

/**@type {import("Types.d.ts").Commands} */
const command = {
  category: "ADMIN",
  name: "embed",
  description: "Make the embed",
  descriptionLocalizations: {
    "es-ES": "Crear el embed",
    "hi": "एम्बेड बनाएं"
},
  permissions: {
    user: ["ManageGuild"], // User perms
    bot: ["EmbedLinks"] // Bot Perms
  },

  options: [
      {
        name: "channel",
        description: "set the channel to send embed",
        channelTypes: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
        type: ApplicationCommandOptionType.Channel,
        required: true,
      },
      {
        name: "message",
        description: "message of the server embed",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "title",
        description: "title of the server embed",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "color",
        description: "color of the embed ex: Red, #fc1d1f",
        type: ApplicationCommandOptionType.String,
        required: false,
        autocomplete: true
      },
    ],

    autocomplete: async (client, interaction) => {
      try {
        const focusedValue = interaction.options.getFocused();
        const choices = [
          { name: "Yellow", value: "Yellow"},
          { name: "White", value: "White" },
          { name: "Aqua", value: "Aqua" },
          { name: "Green", value: "Green" },
          { name: "Blue", value: "Blue" },
          { name: "Yellow", value: "Yellow" },
          { name: "Purple", value: "Purple" },
          { name: "LuminousVividPink", value: "LuminousVividPink" },
          { name: "Fuchsia", value: "Fuchsia" },
          { name: "Gold", value: "Gold" },
          { name: "Orange", value: "Orange" },
          { name: "Red", value: "Red" },
          { name: "Grey", value: "Grey" },
          { name: "Navy", value: "Navy" },
          { name: "DarkAqua", value: "DarkAqua" },
          { name: "DarkGreen", value: "DarkGreen" },
          { name: "DarkBlue", value: "DarkBlue" },
          { name: "DarkPurple", value: "DarkPurple" },
          { name: "DarkVividPink", value: "DarkVividPink" },
          { name: "DarkGold", value: "DarkGold" },
          { name: "DarkOrange", value: "DarkOrange" },
          { name: "DarkRed", value: "DarkRed" },
          { name: "DarkGrey", value: "DarkGrey" },
          { name: "DarkerGrey", value: "DarkerGrey" },
          { name: "LightGrey", value: "LightGrey" },
          { name: "DarkNavy", value: "DarkNavy" },
        ];
        let filtered = [];
        for (const choice of choices) {
          if (choice.name.includes(focusedValue)) filtered.push(choice);
        }
        
        await interaction.respond(filtered.slice(0, 25));
      } catch (error) {
        client.logger.error(`Error: ${error.message}`, error);
      }
    },

async execute(client, interaction, langs, data){
    const { options } = interaction;
    /**@type {TextChannel} */
    const channel = options.getChannel("channel", ChannelType.GuildText);
    const text = options.getString("message");
    const color = interaction.options.getString("color");
    if (color && !isHex(color) && !discordColors().includes(color)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.colors.error)
            .setDescription(langs.l("commands.admin.embed.color_err")),
        ],
        ephemeral: true
      });
    }

    const title = options.getString("title");
    const textEmbed = new EmbedBuilder()
      .setColor(color || client.colors.default)
      .setTitle(title)
      .setDescription(text)
      .setTimestamp()
    channel.send({ embeds: [textEmbed] }).then(() => {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Orange")
                .setDescription(langs.l("commands.admin.embed.successfull", {
                  channel: channel.toString()
                })),
            ],
            ephemeral: true
          });
        });
      }
};

export default command;
