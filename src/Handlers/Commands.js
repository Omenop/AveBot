import { EmbedBuilder } from "discord.js";
import { userSettings } from "#models/Users.js";
import { guildSettings } from "#models/Guild.js";
import AveBot from "#structures/BotClient.js";
import config from "#root/Settings/Config.js";
import AveLangs from "#structures/Languages.js";

/**
 * 
 * @param {AveBot} client 
 * @param {import("discord.js").Interaction} interaction 
 */
export async function commandHandler( client, interaction) {

  if (!interaction.guild) return interaction.reply({ content: "This command only works in servers", ephemeral: true });

  const guildData = await guildSettings(interaction.guild);
  const userData = await userSettings(interaction.user);

  const data = {
    user: userData,
    guild: guildData,
  }
  const langs = new AveLangs(guildData?.lang);
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
      if (!command) return;
  
      if (command.permissions?.user && !interaction.channel.permissionsFor(interaction.member).has(command.permissions.user)) {
        const embed = new EmbedBuilder()
        .setColor(client.colors.error)
        .setDescription(`**You need these permission(s):** \`${command.permissions.user?.join(", ")}\` **To be able to execute the command.**`)
  
        return interaction.reply({ embeds: [embed], ephemeral: true })
      }
      
      if (command.permissions?.user && !interaction.channel.permissionsFor(interaction.guild.members.me).has(command.permissions.bot)) {
        const embed = new EmbedBuilder()
        .setColor(client.colors.error)
        .setDescription(`**I need these permission(s):** \`${command.permissions.bot?.join(", ")}\` **To be able to execute the command.**`)
  
        return interaction.reply({ embeds: [embed], ephemeral: true })
      }
  
      //!needC
      if (command.dev && !config.OWNERS.includes(interaction.user?.id)) {
        return interaction.reply({ content: "owner only", ephemeral: true });
      }
      //!needC
      if (command.userPremium && !userData?.premium) {
        return interaction.reply({ content: "UserPremium Only", ephemeral: true });
      }
      //!needC
      if (command.guildPremium && !guildData?.premium) {
        return interaction.reply({ content: "GuildPremium Only", ephemeral: true });
      }
      
      let cooldown = client.cooldowns.get(`${interaction.commandName}-${interaction.user.username}` );
      if (command.cooldown && cooldown) {
        if (Date.now() < cooldown) {
          //!needC
          interaction.reply(`You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`);
          setTimeout(() => { interaction.deleteReply() }, 5000);
          return;
        }
        client.cooldowns.set(
          `${interaction.commandName}-${interaction.user.username}`,
          Date.now() + command.cooldown * 1000
        );
        setTimeout(() => {
          client.cooldowns.delete(
            `${interaction.commandName}-${interaction.user.username}`
          );
        }, command.cooldown * 1000);
      } else if (command.cooldown && !cooldown) {
        client.cooldowns.set(
          `${interaction.commandName}-${interaction.user.username}`,
          Date.now() + command.cooldown * 1000
        );
      }
      try {
        client.logger.log(`Command executed: '${interaction.commandName}' by ${interaction.user.tag}`)
        await command.execute(client, interaction, langs, data);
    } catch (err) {
      client.logger.error(`Error Execute command ${command.name}`, err)
      //!needC
      const embed = new EmbedBuilder()
        .setTitle('Unknown Error')
        .setDescription("Pls try later :c")
        .setColor(client.colors.error);
      if (interaction.replied || interaction.deferred) {
        return await interaction.followUp({
          embeds: [embed],
          ephemeral: true
        }).catch((e)=>{});
      } else {
        return await interaction.reply({
          embeds: [embed],
          ephemeral: true
        }).catch((e)=>{});
      }
    }
  } else if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      if (!command.autocomplete) return;
      command.autocomplete(client, interaction, data);
    } catch (error) {
      client.logger.error("AutoComplete Error", error)
    }
  
  }
};