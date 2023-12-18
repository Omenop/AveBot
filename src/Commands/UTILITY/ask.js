import { chatGpt } from "#root/src/Utils/ChatGpt.js";
import { EmbedBuilder } from "discord.js";


/**@type {import("Types.d.ts").Commands}  */
const command = {
  category: "UTILITY",
  cooldown: 10,
  name: "ask",
  description: "Ask something to ChatGpt",
  descriptionLocalizations: {
    "es-ES": "Preguntale algo a ChatGpt"
  },
  options: [{
    name: "prompt",
    description: "Text for the conversation",
    descriptionLocalizations: {
      "es-ES": "Texto para la conversación"
    },
    type: 3,
    required: true
  }],
  async execute(client, interaction, langs, data) {
    
    await interaction.reply({ content: langs.l("bot.loading") })
    const prompt = interaction.options.getString("prompt");
    const output = await chatGpt(prompt, client, interaction.user);
    const embed = new EmbedBuilder()
    .setColor(client.colors.default)
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
    .setDescription(output);

    interaction.editReply({ content: "", embeds: [embed] });
  }
};

export default command;