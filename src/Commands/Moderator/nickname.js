import { ApplicationCommandOptionType  } from "discord.js";

/**@type {import("#root/Types.js").Commands} */
export default {
  category: "MODERATION",
  help: "</command>",
  cooldown: 5,
  dev: false,
  enabled: true,
  name: "nickname",
  description: "Set or reset your nickname.",
  descriptionLocalizations: {
    "es-ES": "Establece o reinicia tu apodo.",
    "hi": "अपना नाम या पुनरावृत्ति करें।"
  },
  
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "action",
      description: "Choose the action to perform on your nickname",
      required: true,
      choices: [
        { name: "Set", value: "set" },
        { name: "Reset", value: "reset" },
      ],
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "new_nickname",
      description: "New nickname to set (required for 'set' action)",
      required: false,
    },
  ],

  async execute(client, interaction, langs) {
    const user = interaction.user;
    const guild = interaction.guild;
    const action = interaction.options.getString("action");
    const newNickname = interaction.options.getString("new_nickname");

    try {
      if (action === "set") {
        if (!newNickname) {
          return interaction.reply({
            content: langs.l("commands.nick.err1"),
            ephemeral: true,
          });
        }

        await guild.members.fetch(user.id).then((member) => {
          member.setNickname(newNickname).catch((error) => {
            if (error.code === 50013) {
              return interaction.reply({
                content: "I don't have permission to change your nickname!",
                ephemeral: true,
              });
            } else {
              throw error;
            }
          });
        });

        return interaction.reply({
          content: `${langs.l("commands.nick.new-nick")} ${newNickname}.`,
          ephemeral: true,
        });
      } else if (action === "reset") {
        await guild.members.fetch(user.id).then((member) => {
          member.setNickname(null);
        });

        return interaction.reply({
          content: langs.l("commands.nick.nick-reset"),
          ephemeral: true,
        });
      } else {
        return interaction.reply({
          content: langs.l("commands.nick.err2"),
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error("Error processing nickname command:", error);
      return interaction.reply({
        content: langs.l("commands.nick.err3"),
        ephemeral: true,
      });
    }
  },
};
