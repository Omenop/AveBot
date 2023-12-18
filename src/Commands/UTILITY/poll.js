import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } from "discord.js";
import { isHex, discordColors } from "taskwizard";
import pollSchema from "#models/Polls.js";

/**@type {import("Types.d.ts").Commands}*/
const command = {
  cooldown: 5,
  userPremium: false,
  guildPremium: false,
  dev: false,
  enabled: true,
  category: "UTILITY",
  name: "poll",
  description: "Create a poll with multiple options.",
  "descriptionLocalizations": {
    "es-ES": "Crea una encuesta con múltiples opciones.",
    "hi": "मल्टीपल विकल्पों के साथ एक जनसर्वे बनाएं।"
  },  
  permissions: {
    default: "SendMessages",
    user: [],
    bot: [],
  },
  options: [
    {
      name: "question",
      description: "The poll question.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "option1",
      description: "Type ur Option1 title",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "option2",
      description: "Type ur Option2 title",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "color",
      description: "Poll embed color",
      type: ApplicationCommandOptionType.String,
      required: false,
      autocomplete: true,
    },
  ],

  autocomplete: async (client, interaction) => {
    try {
      const focusedValue = interaction.options.getFocused();
      const choices = [
        { name: "Yellow", value: "Yellow" },
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

      let filteredChoices = choices.filter(choice => choice.name.includes(focusedValue));
      if (filteredChoices.length > 25) {
        filteredChoices = filteredChoices.slice(0, 25);
      }

      await interaction.respond(filteredChoices);
    } catch (error) {
      client.logger.error(`Error: ${error.message}`, error);
    }
  },

  async execute(client, interaction, langs) {
    const color = interaction.options.getString("color");
    const question = interaction.options.getString("question", true);
    const options = [
      interaction.options.getString("option1"),
      interaction.options.getString("option2"),
    ];

    if (color && !isHex(color) && !discordColors().includes(color)) return interaction.reply({ content: "Invalid color.", ephemeral: true });


    const buttons = options.map((option, index) => {
      return new ButtonBuilder()
        .setCustomId(`option_${index + 1}`)
        .setLabel(option.trim())
        .setStyle(ButtonStyle.Primary);
    });

    const checkButton = new ButtonBuilder()
      .setCustomId("check_results")
      .setLabel(langs.l("commands.utility.poll.check_results"))
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents([...buttons, checkButton]);

    const pollEmbed = new EmbedBuilder()
      .setColor(color || "Green")
      .setTitle(langs.l("commands.utility.poll.title"))
      .setThumbnail("https://th.bing.com/th/id/OIP.EN2_yz-ALlw3QM0rC-T3hwHaHa?pid=ImgDet&rs=1")
      .setDescription(`${question}`);

    const message = await interaction.channel.send({ embeds: [pollEmbed], components: [row] });

    const poll = new pollSchema({
      message: message.id,
      question,
      upvotes: [],
      downvotes: [],
    });

    await poll.save();
    await interaction.reply({ content: langs.l("commands.utility.poll.poll_created"), ephemeral: true });




  },
};

export default command;
