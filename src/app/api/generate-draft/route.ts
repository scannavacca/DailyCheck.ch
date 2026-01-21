import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RequestBody = {
  template?: string;
  transcript?: string;
  supplemental?: string;
  language?: string;
  docType?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const template = body.template?.trim() ?? "";
    const transcript = body.transcript?.trim() ?? "";
    const supplemental = body.supplemental?.trim() ?? "";

    if (!template) {
      return NextResponse.json({ error: "Missing template." }, { status: 400 });
    }

    if (!transcript && !supplemental) {
      return NextResponse.json({ error: "Missing source text." }, { status: 400 });
    }

    const model = process.env.OLLAMA_MODEL || "llama3.2";
    const ollamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/chat";

    const system =
      "You are a clinical documentation assistant. Fill the provided template using the dictation and any supplemental notes. " +
      "If information is missing, leave the placeholder or section blank. " +
      "Return only the filled template text, no extra commentary.";

    const user = [
      `Template:\n${template}`,
      transcript ? `\nDictation:\n${transcript}` : "",
      supplemental ? `\nSupplemental notes:\n${supplemental}` : "",
      body.language ? `\nLanguage preference: ${body.language}` : "",
      body.docType ? `\nDocument type: ${body.docType}` : "",
    ].join("\n");

    const res = await fetch(ollamaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const detail = body?.error || `Ollama error (${res.status})`;
      return NextResponse.json({ error: "Draft generation failed", detail }, { status: 502 });
    }

    const data = (await res.json()) as { message?: { content?: string } };
    const content = data?.message?.content?.trim() ?? "";
    return NextResponse.json({ draft: content });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Draft generation failed", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
