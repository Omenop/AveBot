import colors from 'colors';
import moment from 'moment';
import Table from 'cli-table';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { config } from "dotenv";
config();

const webhook = process.env.LOGS ? new WebhookClient({ url: process.env.LOGS}) : undefined;
class AveLog {
  log(message) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(`[${colors.blue(timestamp)}]`, message);
  }

  success(message) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(`[${colors.blue(timestamp)}]`, colors.green(message));
  }

  warn(message) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    console.warn(`[${colors.yellow(timestamp)}]`, message);
  }

  error(message, error, promise) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    if (promise) {
      console.error(`[${colors.bgRed(timestamp)}]`, colors.red("[ERROR]")) 
      console.error(colors.red(error), colors.red(promise));
    } else {
      console.error(`[${colors.bgRed(timestamp)}]`, colors.red("[ERROR]"));
      console.error(colors.red(error))
    }
    if (webhook) {
      if (!message && !error) return;
      const ERROR = error?.stack || error;
      const errEmbed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({ name: ERROR?.name ?? "Error:" })
      .addFields(
        { name: "Promise", value: "```js\n"+ `${JSON.stringify(promise, null, 1) ?? " "}` +"```"},
        { name: "Description", value: message || ERROR?.message || "Unknow" }
        )
      .setDescription(
        "```js\n" + (ERROR.length > 4096 ? `${ERROR.substr(0, 4000)}...` : ERROR) + "\n```"
      );

      webhook.send({
        username: "BotLogs",
        embeds: [errEmbed]
      }).catch((e) => {})
    }
  }

  /**
   * 
   * @param {*} head 
   * @param {*} rows 
   * @param {number} size 
   */
  createTable(head, rows, size = 20) {
    const table = new Table({
      head: head.map(column => colors.blue(column)),
      colWidths: new Array(head.length).fill(size)
    });

    for (const row of rows) {
      table.push(row);
    }

    console.log(table.toString());
  }
}

export default AveLog;