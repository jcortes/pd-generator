import openai from "$lib/openai";
import { error } from "@sveltejs/kit";
import fs from "fs";

export async function load() {
  return {};
  // try {
  //   const args = {
  //     model: "gpt-4",
  //     temperature: 0,
  //   };

  //   const { data: { choices: [{ message: codeMsg }] }} =
  //     await openai.createChatCompletion({
  //       ...args,
  //       messages: [
  //         {
  //           role: "system",
  //           content: "Your goal is to return code that answers the question you are given. The code you should generate should a a Node.js HTTP request using axios. The code you provide should use ESM. It should use async/await instead of promises. You should not return any text other than the code. Do not return helpful messages, only code."
  //         },
  //         {
  //           role: "user",
  //           content: "Create an estimate. The app is zoho_invoice."
  //         },
  //       ],
  //     });

  //   const transformInstructions = fs.readFileSync(
  //     "src/lib/templates/transform.txt",
  //     "utf-8"
  //   );

  //   const { data: { choices: [{ message: transformMsg }] }} =
  //     await openai.createChatCompletion({
  //       ...args,
  //       messages: [
  //         {
  //           role: "system",
  //           content: transformInstructions
  //         },
  //         {
  //           role: "user",
  //           content: `This is the code: ${codeMsg?.content}`
  //         },
  //       ],
  //     });

  //   return {
  //     content: transformMsg?.content,
  //   };
    
  // } catch (err: any) {
  //   console.log(err.response.data);
  //   throw error(err.response.status, err.response.data.error?.message ?? err.message)
  // }
}