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

    // Get email summary and sentiment from the client.
    const body = await req.json();
    const { summary, sentiment } = body;

    const writer = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: z.object({
        tone: z
          .string()
          .describe("Type of sentiment. happy, sad, neutral, frustrated."),
      }),
      system: `You are an email tone picker that analyzes the input and picks up the response email tone. Pick the tone from ${[
        "professional",
        "formal",
        "informal",
        "casual",
        "friendly",
      ]}`,
      prompt: `Here is the email summary: ${summary}, Hers is the email sentiment: ${sentiment}.`,
    });

    return writer.toJsonResponse();
  } catch (error: any) {
    console.error("Uncaught API Error:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
