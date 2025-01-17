import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "Please set OPENAI_API_KEY in your environment variables."
      );
    }

    // Get email from the client.
    const body = await req.json();
    const { email } = body;

    const sentiment = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: z.object({
        sentiment: z
          .string()
          .describe("Type of sentiment. happy, sad, neutral, frustrated."),
      }),
      system: `You are a sentiment analyzer. 
You will analyze user email sentiment.
Respond in JSON format with "sentiment" key
Pick the sentiment key from ${["happy", "frustrated", "neutral", "sad"]}`,
      prompt: `Here is the email: ${email}`,
    });

    return sentiment.toJsonResponse();
  } catch (error: any) {
    console.error("Uncaught API Error:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
