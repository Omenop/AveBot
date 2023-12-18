
/** @type {import("Types.d.ts").Events<"error">} */
export default {
  once: true,
  name: "error",
  execute: async (client, err) => {
    client.logger.error("Client Error", err);
  }
}