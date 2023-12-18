import AveBot from "#structures/BotClient.js";
import Validations from "./Utils/Validations.js";
import "dotenv/config.js";

Validations.validateEnv();

const client = new AveBot();
client.loadEvents("./src/Events");
client.loadCommands("./src/Commands");
client.loadButtons("./src/Rows/Buttons");
client.login(process.env.TOKEN);