import { Events } from "discord.js";

/** @type {import("Types.d.ts").Events<Events.ShardReconnecting>} */
export default {
  once: true,
  name: Events.ShardReconnecting,
  execute: async (client, shard) => {
    client.logger.warn(`Reconnecting Shard #${shard}`);
  }
}