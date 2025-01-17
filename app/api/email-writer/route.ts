import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "Please set OPENAI_API_KEY in your environment variables."
      );
    }
    // Get writer and email summary from the client.
    const body = await req.json();
    const { writer, emailSummary } = body;

    const emailReply = await generateText({
      model: openai("gpt-4-turbo"),
      system: `You are an email writer that writes a concise to the point well written email as a reply to a user email. 
Use the following information to write the email:`,
      prompt: `Writer tone:${writer}\nEmail Summary:${emailSummary}`,
    });

    return new Response(
      JSON.stringify({
        emailReply: emailReply.text,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Uncaught API Error:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
