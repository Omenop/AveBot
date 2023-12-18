//@ts-check
import OpenAi from "openai";
import fs from "node:fs";

const openai = new OpenAi({apiKey: process.env.OPENAI_KEY});

  /**
  * Function to get responses from chatgpt.
  * @param {string} input Prompt 
  * @param {import("#structures/BotClient.js").default} client Bot Client
  * @param {import("discord.js").User} user User who requires the question.
  */
  export async function chatGpt(input, client, user){
    try {
      const chatGPTprompt = fs.readFileSync(`${process.cwd()}/src/Utils/chatGpt.txt`, "utf-8");
      /**@type {string} */
      const chatSystem = chatGPTprompt
          .replaceAll('{botUsername}', client.user.username)
          .replaceAll('{userUsername}', user.username);

      /**@type {OpenAi.ChatCompletionCreateParams["messages"]} */
      const messages = [
      {
        role: "system",
        content: chatSystem
      },
      {
        role: "user",
        content: input,
      },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        max_tokens: 200,
        temperature: 0.9,
        n: 1,
        user: user.id,
        messages: messages,
      })
      const response = completion?.choices?.[0]?.message.content;

  
      return response;
      } 
      catch (e) {
        client.logger.error("OpenAi Error", e);
       return "Sorry, I can't answer that question. Try again later.";
      }
  }
