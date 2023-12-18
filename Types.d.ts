import { 
  ClientEvents, 
  ChatInputCommandInteraction,
  LocalizationMap, 
  APIApplicationCommandOption, 
  ApplicationCommandOptionData,
  PermissionResolvable,
  Client,
  Guild,
  User,
  ColorResolvable,
  AttachmentBuilder,
  ButtonStyle,
  ButtonInteraction,
  AutocompleteInteraction,
  AnySelectMenuInteraction,
  ModalSubmitInteraction
} from "discord.js";
import AveBot from "#structures/BotClient.js";
import AveLangs from "./src/Structures/Languages.js";
import { userSettings } from "./src/Models/Users.js";
import { guildSettings } from "./src/Models/Guild.js";

type DataBases = {
  user: InferResult<typeof userSettings>;
  guild: InferResult<typeof guildSettings>;
};

export interface Events<K extends keyof ClientEvents> {
  once?: boolean;
  name: K;
  execute: (client: AveBot, ...args: ClientEvents[K]) => Awaitable<void>;
}

export type commandCategory = 
 | "ADMIN"
 | "MODERATION"
 | "DEVELOPER"
 | "UTILITY"
 | "MUSIC"
 | "INFORMATION"
 | "Systems"
export interface Commands {
  enabled?: boolean;
  cooldown?: number;
  userPremium?: boolean;
  guildPremium?: boolean;
  dev?: boolean;
  category: commandCategory;
  name: string;
  NameLocalizations?: LocalizationMap;
  description: string;
  descriptionLocalizations?: LocalizationMap;
  help?: string;
  nsfw?:  boolean;
  permissions?: {
    default?: PermissionResolvable;
    user?: PermissionResolvable[];
    bot?: PermissionResolvable[];
    dm?: boolean;
  };
  autocomplete?: (client: AveBot ,interaction: AutocompleteInteraction, data?: DataBases,) => Awaitable<void>;
  options?: ApplicationCommandOptionData[];
  execute: (
    client: AveBot,
    interaction: ChatInputCommandInteraction,
    langs?: AveLangs,
    data?: DataBases,
  ) => void;
}

export interface Buttons {
  enable?: boolean;
  name: string;
  execute: (
    client: AveBot,
    interaction: ButtonInteraction,
    data: DataBases
  ) => Awaitable<void>;
}

export interface SelectMenus {
  enable?: boolean;
  name: string;
  execute: (
    client: AveBot,
    interaction: AnySelectMenuInteraction,
    data: DataBases
  ) => Awaitable<void>;
}

export interface Modals {
  enable?: boolean;
  name: string;
  execute: (
    client: AveBot,
    interaction: ModalSubmitInteraction,
    data: DataBases
  ) => Awaitable<void>;
}

export interface CommandsCategories {
 category: commandCategory;
 description: string;
 emoji: string;
 image: string;
}

type InferResult<F> = ReturnType<F> extends Promise<infer T> ? T : never;
type Awaitable<T> = PromiseLike<T> | T;
export type ConfigColors = {
  default: ColorResolvable;
  error: ColorResolvable;
}