import AveLangs from "#root/src/Structures/Languages.js";
import { ApplicationCommandOptionType } from "discord.js";

/**@type {import("#root/Types.js").Commands} */
const command = {
  category: "ADMIN",
  cooldown: 5,
  name: "language",
  description : "Set new Lang for guild",
  permissions: {
    default: "ManageGuild",
    user: ["ManageGuild"]
  },
  options: [
    {
      type: ApplicationCommandOptionType.String,
      required: true,
      name: "newlang",
      description: "Select new language",
      descriptionLocalizations: {
        "es-ES": "Selecciona un nuevo idioma"
      },
      choices: [
        { name: "English", value: "en"},
        { name: "Español", value: "es" },
        { name: "Hindi", value: "hi"}
      ]
    }
  ],
  async execute(client, interaction, langs, data) {
    await interaction.deferReply();
    const guildSettings = data.guild;
    const newLang = interaction.options.getString("newlang");
    const languages = new AveLangs(newLang);
    guildSettings.lang = newLang;
    await guildSettings.save();
    interaction.editReply(
      languages.l("commands.config.lang.changed")
    );
  }
}

export default command;