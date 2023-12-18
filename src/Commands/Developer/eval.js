import { EmbedBuilder } from "discord.js"
/**@type {import("Types.d.ts").Commands}  */
const command = {
  category: "DEVELOPER",
  name: "eval",
  description: "Evaluate JavaScript code",
  dev: true,
  options: [ 
    {
      type: 3,
      name: "code",
      description: "Write script to evaluate",
      required: true
    }
   ],
  
  async execute(client, interaction, data) {
    const code = interaction.options.getString("code");
    await interaction.deferReply();
    try{
      const result = eval(code);
      let result2 = JSON.stringify(result, null, 2)
      if(!result) return
      
      result2 = result2.replaceAll(process.env.TOKEN, "🐧")
      result2 = result2.replaceAll(process.env.MONGO_URI, "🐧")
      result2 = result2.replaceAll(process.env.LOGS, "🐧")
      if (result2.length > 2000) {
          result2 = result2.substring(0, 2000) + '...'
      }
      interaction.editReply({ 
          embeds: [ new EmbedBuilder()
          .setTitle("Script Result")
          .setDescription(`\`\`\`js\n${result2}\`\`\``)
          .setColor(client.colors.default)
          ]})
  } catch(e) {
      interaction.editReply({ 
        embeds: [ new EmbedBuilder()
          .setTitle("ERROR")
          .setDescription(`\`\`\`${e}\`\`\``)
          .setColor(client.colors.default)
      ]})
   }
  }
};

export default command;