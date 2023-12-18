

import response from "#root/src/Utils/imagine.js";
import { EmbedBuilder } from "discord.js";


/**@type {import("Types.d.ts").Commands}  */
const command = {
  category: "UTILITY",
  cooldown: 15,
  name: "imagine",
  description: "Create a image from a text",
  descriptionLocalizations: {
    "es-ES": "Crea una imagen a partir de un texto"
  },
  options: [{
    name: "prompt",
    description: "Text for imagine",
    descriptionLocalizations: {
      "es-ES": "Texto para la imagen"
    },
    type: 3,
    required: true
  }],
  async execute(client, interaction, langs, data) {
    await interaction.deferReply();

    const prompt = interaction.options.getString("prompt");
    const output = await response(client, prompt);
    const embed = new EmbedBuilder()
    .setColor(client.colors.default)
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
    .setImage(output)

    return interaction.editReply({ content: "", embeds: [embed] });
  }
};

export default command;