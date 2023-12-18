import AveLog from "../Structures/Logs.js";

const logger = new AveLog();
/**
 * Class containing various validation functions.
 */
class Validations {
  /**
   * Validates the contents of the .env file.
   * @throws {Error} If the TOKEN or LOGS variable is empty.
   */
  static validateEnv() {
    logger.log("[🔎]Validating Environment Variables");
    if (!process.env.TOKEN) {
      throw new Error("TOKEN cannot be empty.");
    }

    if (!process.env.LOGS) {
      logger.warn("LOGS is empty, logs will not be saved.");
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO URI cannot be empty.");
    }

    if (!process.env.OPENAI_KEY) {
      logger.warn("OPENAI_KEY is empty, some commands will not work");
    }

    logger.success("[✅]Env Validated Successfully");
  }

  /**
   * Validates an event object.
   * @param {Object} event - The event object to validate.
   * @throws {Error} If the event object is not an object or if its name does not start with "on".
   */
  static validateEvent(event) {
    if (typeof event !== "object") {
      throw new Error(`Event must be an object. Received: ${typeof event}(${event})`);
    }

    if (!event?.name || typeof event.name !== "string") {
      throw new Error(`Event name must be a string. Received: ${typeof event.name}(${event.name})`);
    }
  }

  /**
   * Validates a command object.
   * @param {import("#root/Types.js").Commands} command - The command object to validate.
   * @throws {Error} If the command is not enabled, does not have an execute function, or has an uppercase name.
   */
  static validateCommand(command) {
    if (!command.name || !command.description) {
      throw new Error(`Command must have a name and description. Received: ${command.name}(${command.description})`);
    }

    if (!command.execute || typeof command.execute !== "function") {
      throw new Error("Command must have an execute function.");
    }

    if (command.name.toLowerCase() !== command.name) {
      throw new Error(`Command name must be lowercase. Received: ${command.name}`);
    }
  }
}

export default Validations;