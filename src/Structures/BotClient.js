import { Client, GatewayIntentBits, Partials, Collection, OAuth2Scopes } from "discord.js";
import { searchFilesRecursive } from "taskwizard";
import AveLog from "#structures/Logs.js";
import Config from "#root/Settings/Config.js";
import emojis from "#root/Settings/Emojis.js";
import Validations from "../Utils/Validations.js";

/**
 * Bot Client 
 */
export default class AveBot extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [Partials.User, Partials.Message, Partials.Reaction],
      allowedMentions: {roles: [], users: [], repliedUser: false },
      failIfNotExists: true,
    });

    /** @type {Collection<string, import("Types.d.ts").Commands>} */
    this.commands = new Collection();

    /** @type {Map<string, number>} */
    this.cooldowns = new Map();

    /**@type {Map<string, import("Types.d.ts").Buttons>} */
    this.buttons = new Map();
    /**@type {Map<string, import("Types.d.ts").SelectMenus>} */
    this.menus = new Map();
    /**@type {Map<string, import("Types.d.ts").Modals>} */
    this.modals = new Map();

    this.config = Config;

    this.colors = Config.COLORS;

    this.emoji = emojis;

    this.logger = new AveLog();

    // Unresolved promise error handler
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error("UnHandled Rejection", reason, promise);
    });

    // Manejador de errores no capturados
    process.on('uncaughtException', (err) => {
      this.logger.error(`Uncaught Exception:`, err);
    });
  }

  /**
   * Function to load events files
   * @param {string} directory  - Directory where is Events files.
   */
  async loadEvents(directory) {
    const files = await searchFilesRecursive(directory);
    const rows = [];
  
    for(const file of files) {
      const event = (await import(`file://${file}`)).default;
      if (typeof event !== "object") continue;
      try {
        if (event.once) {
          this.once(event.name, (...args) => event.execute(this, ...args));
        } else {
         this.on(event.name, (...args) => event.execute(this, ...args));
        }
        rows.push([event.name, '✔']);
      } catch (err) {
        rows.push([event.name, '❌']);
        this.logger.error(`Fail to load Event '${event.name ?? event}'`, err.message)
      }
    }
  
    this.logger.createTable(['Event', 'Status'], rows);
  }

  /**
   *  Function to Load SlashCommand Files
   * @param {string} directory - Directory where is Commands files.
   */
  async loadCommands(directory) {
   this.logger.log(`(⌛) Loading commands...`);
   const files = await searchFilesRecursive(directory);

   for (const file of files) {
    const now = Date.now();
     try {
      /**@type {import("Types.d.ts").Commands} */
      const cmd = (await import(`file://${file}?updatedAt=${now}`)).default;
       if (typeof cmd !== "object" || !cmd.name) continue;
       Validations.validateCommand(cmd);
      
       if (typeof cmd.enabled === "boolean" && !cmd.enabled) {
        this.logger.log(`Skipping slash command ${cmd.name}. Disabled!`);
      } else {
        if (this.commands.has(cmd.name)) throw new Error(`Slash Command ${cmd.name} already registered`);
        this.logger.log(`Loading command: ${cmd.name}`)
        this.commands.set(cmd.name, cmd);
      }
     } catch (err) {
       this.logger.error(`Failed to load ${file} Reason:`, err);
     }
   }

   this.logger.success(`Loaded ${this.commands.size} commands`);
   if (this.commands.size > 100) throw new Error("A maximum of 100 slash commands can be enabled");
 }

 /**
  * 
  * @param {string} directory - Directory where is all Buttons Files
  */
 async loadButtons(directory) {
  const files = await searchFilesRecursive(directory);
  for (const file of files){
    try {
      /**@type {import("Types.d.ts").Buttons} */
      const button = (await import(`file://${file}`)).default;
      if (
        (typeof button !== "object" || !button.name) || (typeof button.enable !== "boolean" || !button.enable)
      ) continue;
      else {
        this.buttons.set(button.name, button);
      }
    } catch (error) {
      this.logger.error(`Fail to load ${files}`, error);
    }
  }
  this.logger.success(`Loaded ${this.buttons.size} Buttons Files`);
 }


async createSlash() {
  /** @type {import("discord.js").ApplicationCommandDataResolvable[]} */
  const slashCommands = [];
  const devCommands = [];
  this.commands.forEach((cmd) => {
    if (cmd.dev)  {
      devCommands.push({
        name: cmd.name,
        nameLocalizations: cmd.NameLocalizations,
        description: cmd.description,
        descriptionLocalizations: cmd.descriptionLocalizations,
        type: 1,
        dmPermission: cmd.permissions?.dm ?? false,
        defaultMemberPermissions : cmd.permissions?.default ?? null,
        nsfw: cmd.nsfw,
        options: cmd.options,
      })
    } else {
      slashCommands.push({
        name: cmd.name,
        nameLocalizations: cmd.NameLocalizations,
        description: cmd.description,
        descriptionLocalizations: cmd.descriptionLocalizations,
        type: 1,
        dmPermission: cmd.permissions?.dm ?? false,
        defaultMemberPermissions : cmd.permissions?.default ?? null,
        nsfw: cmd.nsfw,
        options: cmd.options,
      })
    }    
  });

  await this.application?.commands.set(slashCommands);
  if (this.config.DevSevers.length) {
    for (const guildId of this.config.DevSevers) {
      const guild = await this.guilds.fetch(guildId).catch(() => null);
      if (!guild) continue;
      await guild.commands.set(devCommands);
      this.logger.log(`[✅] Successfully Registered ${devCommands.length} SlashCommands in ${guild.name}`);
    }
  }

  this.logger.success(`[✅] Successfully Registered ${slashCommands.length} SlashCommands Globally`);
 }

 invite() {
  return this.generateInvite({
    scopes: [ OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands ],
    permissions: [
      "AddReactions",
      "AttachFiles",
      "BanMembers",
      "ChangeNickname",
      "DeafenMembers",
      "EmbedLinks",
      "KickMembers",
      "ManageChannels",
      "ManageGuild",
      "ManageMessages",
      "ManageNicknames",
      "ManageRoles",
      "ModerateMembers",
      "MoveMembers",
      "MuteMembers",
      "ReadMessageHistory",
      "SendMessages",
      "ViewChannel",
    ],
  })
 }

}