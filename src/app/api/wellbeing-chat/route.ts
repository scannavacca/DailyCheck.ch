import { NextResponse } from "next/server";

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

    const model = process.env.OLLAMA_MODEL || "llama3.2";
    const ollamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/chat";
    const res = await fetch(ollamaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [{ role: "system", content: SYSTEM_POLICY }, ...input],
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const detail = body?.error || `Ollama error (${res.status})`;
      return NextResponse.json({ error: detail }, { status: 502 });
    }

    const data = (await res.json()) as { message?: { content?: string } };
    const text = data?.message?.content?.trim() ?? "";
    return NextResponse.json({ reply: text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error." }, { status: 500 });
  }
}
