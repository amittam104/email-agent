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

    const decision = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: z.object({
        respond: z
          .string()
          .describe(
            "Wheather to respond or not. True or False in string format"
          ),
        category: z.string().describe("primary or spam"),
        byWhen: z.string().describe("date"),
        priority: z.string().describe("urgent, high, medium, low"),
      }),
      system: `You are a decision maker that analyzes and decides if the given email requires a response or not. 
Make sure to check if the email is spam or not. If the email is spam, then keep the respond key false, category key spam, byWhen key 'N/A' and priority key 'N/A'.
If it requires a response, based on the email urgency, decide the response date. Also define the response priority.
Keep the byWhen and priority keys 'N/A' if the email does not require a response.

Use following keys and values accordingly
- respond: true or false in string format
- category: primary or spam in string format
- byWhen: 'replace with date in YYYY-MM-DD in stringformat when to reply the email'
- priority: urgent or high or medium or low in string format`,
      prompt: `Here is the email summary: ${summary}, Hers is the email sentiment: ${sentiment}.`,
    });

    return decision.toJsonResponse();
  } catch (error: any) {
    console.error("Uncaught API Error:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
