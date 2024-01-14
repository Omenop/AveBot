import { TicTacToe, Hangman, RockPaperScissors } from "discord-gamecord";

export async function ttt(interaction) {
  const player1 = interaction.user;
  const player2 = interaction.options.getUser('opponent') || interaction.guild.members.cache
    .filter(member => member.user.id !== player1.id)
    .first().user;

  const ticTacToeGame = new TicTacToe({
    player: player1,
    opponent: player2,
    message: interaction,
  });

  await ticTacToeGame.startGame();

  ticTacToeGame.on('end', (game, winner) => {
    const resultEmbed = game.getGameEmbed()
      .setDescription(winner ? `Player ${winner.username} wins!` : 'It\'s a tie!');
    interaction.editReply({ embeds: [resultEmbed], components: [] });
  });
}

export async function hangman(interaction) {
  const hangmanGame = new Hangman({
    message: interaction,
    word: "example",
  });

  await hangmanGame.startGame();

  hangmanGame.on('end', (game, winner) => {
    const resultEmbed = game.getGameEmbed()
      .setDescription(winner ? `Player ${winner.username} wins!` : 'It\'s a tie!');
    interaction.editReply({ embeds: [resultEmbed], components: [] });
  });
}

export async function rps(interaction) {
  const player1 = interaction.user;
  const player2 = interaction.options.getUser('opponent') || interaction.guild.members.cache
    .filter(member => member.user.id !== player1.id)
    .first().user;

  const rpsGame = new RockPaperScissors({
    player: player1,
    opponent: player2,
    message: interaction,
  });

  await rpsGame.startGame();

  rpsGame.on('end', (game, winner) => {
    const resultEmbed = game.getGameEmbed()
      .setDescription(winner ? `Player ${winner.username} wins!` : 'It\'s a tie!');
    interaction.editReply({ embeds: [resultEmbed], components: [] });
  });
}
