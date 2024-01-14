import { ApplicationCommandOptionType } from "discord.js";
import { ttt, hangman, rps } from './shared/gamecord.js';

export default {
  category: "UTILITY",
  help: "</command>",
  permissions: {
    bot: ["ManageMessages"],
    user: ["ManageMessages"]
  },
  name: "game",
  description: "Play Various Games",
  descriptionLocalizations: {
    "es-ES": "Juega varios juegos",
    "hi": "विभिन्न खेलों को खेलें"
  },
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "ttt",
      description: "Play Tic Tac Toe",
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "opponent",
          description: "The opponent to play against",
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "hangman",
      description: "Play Hangman",
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "rps",
      description: "Play Rock, Paper, Scissors",
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "opponent",
          description: "The opponent to play against",
          required: true,
        },
      ],
    },
  ],

  async execute(client, interaction, langs) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "ttt") {
      await ttt(interaction);
    } else if (subcommand === "hangman") {
      await hangman(interaction);
    } else if (subcommand === "rps") {
      await rps(interaction);
    }
  }
};
