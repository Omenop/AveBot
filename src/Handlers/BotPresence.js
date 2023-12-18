import Config from "#root/Settings/Config.js";
import { ActivityType, Client } from "discord.js";

/**
 * Bot Presence Function. All config will be in Config.js
 * @param {Client} client 
 */
export function botPrecence(client) {
  const types = {
    PLAYING: ActivityType.Playing,
    LISTENING: ActivityType.Listening,
    WATCHING: ActivityType.Watching,
    STREAMING: ActivityType.Streaming,
    COMPETING: ActivityType.Competing
  }

setInterval(async () => {
    const guilds = await client.guilds.fetch();
    const userCounts = await Promise.all(guilds.map(async (g) => (await g.fetch()).memberCount));
    const users = userCounts.reduce((a, b) => a + b, 0);
    const servers = guilds.size;
  
    const messages = Config.PRECENSE.MESSAGES;
    const message = messages[Math.floor(Math.random() * messages.length)].replace("{servers}", servers.toString()).replace("{users}", users.toString());
  
    client.user.setPresence({
      status: Config.PRECENSE.STATUS,
      activities: [
        { name: message, type: types[Config.PRECENSE.TYPE], url: Config.PRECENSE.URL }
      ]
    })
}, Config.PRECENSE.MESSAGES_TIME * 1000);
}