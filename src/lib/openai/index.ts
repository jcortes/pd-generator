import fsExtra from "fs-extra";
import { error } from "@sveltejs/kit";
import { OpenAIApi, Configuration } from "openai";
import { env } from "$env/dynamic/private";

const systemDocs = fsExtra.readFileSync("prompts/system2.md", "utf-8");
// const transformDocs = fs.readFileSync("prompts/transform1.md", "utf-8");

const config = new Configuration({
  apiKey: env.OPENAI_API_KEY
});

const openai = new OpenAIApi(config);

async function createChatCompletion(prompt: string) {
  try {
    const args = {
      model: "gpt-4",
      temperature: 0
    };

    const { data: { choices: [{ message: codeMsg }] }} =
      await openai.createChatCompletion({
        ...args,
        messages: [
          {
            role: "system",
            content: systemDocs
          },
          {
            role: "user",
            content: prompt
          },
        ],
      });

    return codeMsg?.content;
    
  } catch (err: any) {
    console.log(err.response?.data);
    throw error(err.response?.status, err.response.data.error?.message ?? err.message)
  }
}

export default {
  createChatCompletion,
};
