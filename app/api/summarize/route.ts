import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

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

    const summary = await generateText({
      model: openai("gpt-4-turbo"),
      system: `You are a content summarizer. 
You will summarize content without loosing context into less wordy to the point version.`,
      prompt: `Summarize the following email:${email}`,
    });

    return new Response(
      JSON.stringify({
        summary: summary.text,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Uncaught API Error:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
