import categories from "#root/Settings/Categories.js";
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

/**@type {import("Types.d.ts").Commands} */
const command = {
  enabled: true,
  category: "UTILITY",
  help: "HELP XD", 
  cooldown: 5,
  name: "help",
  description: "Help Menu",
  descriptionLocalizations: {
    "es-ES": "Menu de Ayuda",
  },
  permissions: {
    dm: true
  },
  options: [
    {
      type: 3,
      name: "command",
      description: "The command you want see help for",
      autocomplete: true
    }
  ],
  autocomplete: async (client, interaction) => {
    try {
      const focusedValue = interaction.options.getFocused();
      const choices = client.commands.map((cmd) => ({ name: cmd.name, value: cmd.name }));
      let filtered = [];
      for (const element of choices) {
        const choice = element;
        if (choice.name.includes(focusedValue)) filtered.push(choice);
      }
      await interaction.respond(filtered);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }, 
  async execute(client, interaction, langs, data) {
    await interaction.deferReply();
    const commands = await client.application.commands.fetch();
    const fileCommands = client.commands;
    const optionCommand = interaction.options.getString("command");
    const emojis = client.emoji;
    const categoriesNames = categories.map(c => (`- ${c.emoji} | \`${c.category}\``)).join("\n");

    const helpEmbed = new EmbedBuilder()
      .setColor(client.colors.default)
      .setThumbnail(client.user.displayAvatarURL())
      .setTitle(langs.l("commands.helpmenu.embed1.title", { name: client.user?.username }))
      .setDescription(langs.l("commands.helpmenu.embed1.desc", { name: client.user.username }))
      .addFields(
        {
          name: langs.l("commands.helpmenu.embed1.field1"),
          value: categoriesNames
        },
        {
          name: langs.l("commands.helpmenu.embed1.field2.name"),
          value: langs.l("commands.helpmenu.embed1.field2.value", { invite: client.invite(), server: client.config.SupportServer}),
          inline: false
        }
      )

    if (optionCommand) {
      await handleOptionCommand(interaction, fileCommands, optionCommand, langs);
    } else {
      await handleHelpMenu(interaction, client, helpEmbed, commands, fileCommands, emojis, langs);
    }
  }
};

async function handleOptionCommand(interaction, fileCommands, optionCommand, langs) {
  const cmd = fileCommands.find((cmd) => cmd.name === optionCommand);
  if (!cmd) {
    interaction.editReply("`❌` | Comando Invalido.");
    return;
  }
  const embed = new EmbedBuilder()
    .setColor(client.colors.default)
    .setTitle(`Command: ${cmd.name}`)
    .setDescription(cmd.help ?? cmd.description);

  return interaction.editReply({ embeds: [embed] });
}

async function handleHelpMenu(interaction, client, helpEmbed, commands, fileCommands, emojis, langs) {
  const options = categories.map(c => {
    return new StringSelectMenuOptionBuilder()
      .setValue(c.category)
      .setLabel(c.category)
      .setEmoji(c.emoji)
      .setDescription(c.description);
  });

  const helpMenu = new ActionRowBuilder();
  helpMenu.addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("helpmenu")
      .setPlaceholder(langs.l("commands.helpmenu.placeholder"))
      .addOptions(options)
  );

  const buttons = new ActionRowBuilder();
  buttons.addComponents(
    new ButtonBuilder().setCustomId("previousBtn").setEmoji(emojis.back).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("homeBtn").setEmoji(emojis.home).setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("nextBtn").setEmoji(emojis.next).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("endBtn").setEmoji(emojis.delete).setStyle(ButtonStyle.Danger),
  );

  const msg = await interaction.editReply({ embeds: [helpEmbed], components: [helpMenu, buttons] });
  const collector = msg.createMessageComponentCollector({
    idle: 30 * 1000,
  });
  let arrEmbeds = [];
  let currentPage = 0;
  collector.on("collect", async response => {
    if (interaction.user.id !== response.user.id) return;
    await response.deferUpdate();

    const menuRow = msg.components[0];
    const buttonsRow = msg.components[1];

    switch (response.customId) {
      case "endBtn":
        collector.stop();
        break;

      case "homeBtn":
        currentPage = 0;
        await msg.edit({ embeds: [helpEmbed], components: [menuRow, buttonsRow] }).catch(console.error);
        break;

      case "previousBtn":
        if (currentPage !== 0) {
          --currentPage;
          await msg.edit({ embeds: [arrEmbeds[currentPage]], components: [menuRow, buttonsRow] }).catch(console.error);
        }
        break;

      case "nextBtn":
        if (currentPage < arrEmbeds.length - 1) {
          currentPage++;
          await msg.edit({ embeds: [arrEmbeds[currentPage]], components: [menuRow, buttonsRow] }).catch(console.error);
        }
        break;

      case "helpmenu": {
        arrEmbeds = []
        const cat = response.values[0];
        const imgCategory = categories.find(c => c.category === cat)?.image ?? client.user.displayAvatarURL();
        currentPage = 0;
        const arrayCommandsFiles = Array.from(fileCommands.filter(cmd => cmd.category === cat).values());
        const arrayCommands = Array.from(commands.filter(cmd => arrayCommandsFiles.some(c => c.name === cmd.name)).values());

        const pageSize = 2;

        if (!arrayCommands.length) {
          const embed = new EmbedBuilder()
            .setColor(client.colors.default)
            .setThumbnail(imgCategory)
            .setTitle(langs.l("commands.helpmenu.cat.title", { category: cat }))
            .setDescription(langs.l("commands.helpmenu.cat.nocat"));
          await msg.edit({ embeds: [embed], components: [menuRow, buttonsRow] });
          return;
        }

        for (let i = 0; i < arrayCommands.length; i += pageSize) {
          const cmds = arrayCommands.slice(i, i + pageSize);
          let currentPageNumber = Math.floor(i / pageSize) + 1;
          const embedBuilder = new EmbedBuilder()
            .setColor(client.colors.default)
            .setThumbnail(imgCategory)
            .setTitle(langs.l("commands.helpmenu.cat.title", { category: cat }))
            .setFooter({ text: langs.l("commands.helpmenu.cat.footer", { page: currentPageNumber, pages: Math.ceil(arrayCommands.length / pageSize) }), iconURL: `${client.user.displayAvatarURL() }` });

          cmds.forEach(cmd => {
            const subCmds = cmd.options?.filter(op => op.type === ApplicationCommandOptionType.Subcommand);
            const subCmdsString = subCmds?.map(s => `- </${cmd.name} ${s.name}:${cmd.id}> *${s.description}*`).join("\n");
            const cmdString = `- </${cmd.name}:${cmd.id}> *${cmd.description}*\n`;
            embedBuilder.addFields([
              {
                name: langs.l("commands.helpmenu.cat.field1", {name: cmd.name}), value: `${subCmds.length > 0 ? subCmdsString : cmdString}`
              }
            ]);
          });

          arrEmbeds.push(embedBuilder);
        }
      }
        msg.editable && (await msg.edit({ embeds: [arrEmbeds[currentPage]], components: [menuRow, buttonsRow] }));
        break;

    }
  });

  collector.on("end", () => { msg.edit({ components: [] }) });

}

export default command;
