import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export const runtime = "nodejs";

type ChatMsg = { role: "user" | "assistant"; content: string };

const SYSTEM_POLICY = `
You are a helpful assistant.

Guidelines:
- Be concise and direct.
- Ask clarifying questions when needed.
- If a request is ambiguous, suggest a few options.
`;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { userMessage?: string; messages?: ChatMsg[] };
    const messageHistory = body.messages ?? [];
    const userMessage =
      body.userMessage ?? [...messageHistory].reverse().find((m) => m.role === "user")?.content ?? "";

    if (!userMessage) return NextResponse.json({ error: "No user message." }, { status: 400 });

    const input: ChatMsg[] = messageHistory.length
      ? messageHistory
      : [
          {
            role: "user",
            content: userMessage,
          },
        ];

    const response = await openai.responses.create({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4.1-mini",
      input: [{ role: "system", content: SYSTEM_POLICY }, ...input],
    });

    const text = (response as any).output_text ?? "";
    return NextResponse.json({ reply: text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error." }, { status: 500 });
  }
}
