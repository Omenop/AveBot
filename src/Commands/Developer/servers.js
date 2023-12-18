import { EmbedBuilder } from "discord.js";

/**@type {import("#root/Types.js").Commands} */
const command = {
  category: "DEVELOPER",
  name: "servers",
  description: "List server of bot",
  dev: true,
  
  async execute(client, interaction, data) {
    await interaction.deferReply();

    const guilds = await client.guilds.fetch();
    const embed = new EmbedBuilder()
      .setColor(client.colors.default)
      .setTitle(`Server list | ${client.user.username}`);

    for (const guild of guilds.values()) {
      const fetchedGuild = await guild.fetch();
      const field = {
        name: fetchedGuild.name,
        value: "```yml\n" + `MEMBERS: ${fetchedGuild.memberCount}\n` + "```",
        inline: false
      };
      embed.addFields(field);
    }

    interaction.editReply({ embeds: [embed] });
  }
};

export default command;
