/** 
 * @type {import("Types.d.ts").Commands}
*/
const command = {
  category: "INFORMATION",
  enabled: true,
  cooldown: 5,
  permissions: {
    bot: ["EmbedLinks", "SendMessages"]

  },
  name: "ping",
  description: "show ping",
  
  async execute(client, interaction) {
    const ping = client.ws.ping
    interaction.reply({
      content: `PONG!\n\`${ping > 300 ? "🔴" : "🟢"} | ${ping}ms\``,
      ephemeral: true
    });
  }
}

export default command;