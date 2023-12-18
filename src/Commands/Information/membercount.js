import {
    EmbedBuilder
} from "discord.js";

/**@type {import("Types.d.ts").Commands}*/
const command = {
    category: "INFORMATION",
    name: "membercount",
    description: "Shows the number of members in the server.",
    descriptionLocalizations: {
        "es-ES": "muestra el número de miembros del servidor",
        "hi": "सर्वर में सदस्यों की संख्या दिखाता है"
    },
    permissions: {
        user: ["Administrator"],
        bot: ["Administrator"]
    },

    async execute(client, interaction, langs) {
        const memberCount = interaction.guild.memberCount;

        const embed = new EmbedBuilder()
            .setTitle("Member Count")
            .setColor(client.colors.default)
            .setDescription(langs.l("commands.info.memberCount", {
                members: memberCount
            }))
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    },
};

export default command;