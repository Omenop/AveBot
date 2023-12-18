/**
   *  * Welcoame to AveBot Settings 
   * - Here you can configure the bot to your liking.
   */
export default { 
  /** 
   * @type {string[]}
   */
  OWNERS: ["838338447932391436"],
  /** 
   * @type {string[]}
   */
  DevSevers: ["your server id"],

  /** 
   * @type {string}
  */
  SupportServer: "https://discord.gg/swxpFC9e7u",

  /** Default lang for guilds 
   * @type {"es" | "en"}
   */
  LANG: "en",

/**@type {import("../Types.d.ts").ConfigColors} */
  COLORS: {
    default: "#f1602a",
    error: "#F12a2d"
  },
  PRECENSE: {
    /** The bot's status [online, idle, dnd, invisible] 
     * @type {'online' | 'idle' | 'dnd' | 'invisible'}
    */
    STATUS: "online",
    /** 
     * @type {"PLAYING" | "STREAMING" | "LISTENING" | "WATCHING" | "COMPETING" }
    */
    TYPE: "RAMDOM",
    URL: "https://",
    /**
     * Array Messages for precence
     * @type {string[]}
     */
    MESSAGES: [
      "{servers} Servers",
      "{users} Users",
    ],
    /**
     * Tiempo en seguntos para el intervalos de cada mensaje de la presencia.
     * @type {number}
     */
    MESSAGES_TIME: 5
  },

};