import { EmbedBuilder, version, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import taskwizard from "taskwizard";

/**@type {import("Types.d.ts").Commands}*/

const command = {
  category:"INFORMATION",
    name: "botinfo",
    description: "Show Bot info",

    async execute(client, interaction, langs) {

      const guilds = await client.guilds.fetch();
      const channels = client.channels.cache.size;
      const users = client.guilds.cache.reduce(
        (size, g) => size + g.memberCount,
        0
      );

      let desc = "";
       desc += `Total servers: ${guilds.size}\n`;
       desc += `Total users: ${users}\n`;
       desc += `Total channels: ${channels}\n`;
       desc += `Total commands: ${client.commands.size}\n`;
       desc += `Bot Ping: ${client.ws.ping}ms\n`;
       desc += "\n";

        const embed = new EmbedBuilder()
            .setTitle("Member Count")
            .setColor(client.colors.default)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(desc)
            .addFields(
                {
                  name: "Bot's version",
                  value: `Discord.js: ${version}\nNode.js: ${process.versions.node}`,
                  inline: true,
                },
                {
                  name: "Uptime",
                  value: "```yml\n" + `${taskwizard.formatTimeFromSeconds(process.uptime())}` + "```",
                  inline: false,
                },
              );
    /**@type {ActionRowBuilder<ButtonBuilder>} */
        const row = new ActionRowBuilder();
            row.addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setLabel("Invite Me")
              .setEmoji(client.emoji.link)
              .setURL(client.invite()),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setLabel("SupportServer")
              .setEmoji(client.emoji.support)
              .setURL(client.config.SupportServer)
    );

    interaction.reply({ embeds: [embed], components: [row] });
    },
};

export default command;