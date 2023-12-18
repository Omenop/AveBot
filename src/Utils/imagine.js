import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({apiKey: process.env.OPENAI_KEY});

export default async function (client, prompt) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    quality: "hd",
    prompt: prompt,
    response_format: "url",
    n: 1,
  });

  return response.data[0].url;
}