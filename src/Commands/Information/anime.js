import {
  EmbedBuilder
} from "discord.js";
import { getInfoFromName } from "mal-scraper";

/**@type {import("Types.d.ts").Commands}*/
const command = {
  category: "INFORMATION",
  name: "anime",
  description: "Show info of a Anime",
  options: [
    {
      type: 3,
      name: "anime",
      description: "write anime to get info",
      required: true
    }
  ],

  async execute(client, interaction, langs) {
    await interaction.deferReply();
    const anime = await getInfoFromName(interaction.options.getString("anime"))
    const embed = new EmbedBuilder()
    .setColor(client.colors.default)
    .setTimestamp()
    .setTitle(anime.title)
    .setURL(anime.url)
    .setDescription(anime.synopsis)
    .setImage(anime.picture)

    interaction.editReply({ embeds: [embed] })
  },
};

export default command;