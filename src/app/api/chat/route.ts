import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { MODEL_CONFIG, SYSTEM_PROMPT } from "@/lib/ai-config";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: MODEL_CONFIG.model,
      temperature: MODEL_CONFIG.temperature,
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error("Streaming backend error:", error);
    return new Response(JSON.stringify({ error: "Failed to process stream" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}