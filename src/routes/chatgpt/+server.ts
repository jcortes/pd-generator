import { json, error } from "@sveltejs/kit";
import openai from "$lib/openai";

export async function POST({ request }) {
  const payload = await request.json();

  try {
    const { data } = await openai.createChatCompletionV2(payload);
    return json(data);
    
  } catch (err) {
    console.log(err);
    throw error(400, "Error!!!");
  }
}
