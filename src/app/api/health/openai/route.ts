import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ollamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
    const res = await fetch(`${ollamaUrl.replace(/\/api\/chat$/, "")}/api/tags`);
    return NextResponse.json({ ok: res.ok });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
