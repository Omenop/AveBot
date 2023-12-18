
/** @type {import("Types.d.ts").Events<"warn">} */
export default {
  once: true,
  name: "warn",
  execute: async (client, message) => {
    client.logger.warn(message);
  }
}