import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const language = form.get("language");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing audio file (field name: file)." },
        { status: 400 }
      );
    }

    const targetUrl = process.env.LOCAL_WHISPER_URL || "http://127.0.0.1:5001/transcribe";

    const forwardForm = new FormData();
    forwardForm.append("file", file);
    if (typeof language === "string" && language) {
      forwardForm.append("language", language);
    }

    const res = await fetch(targetUrl, {
      method: "POST",
      body: forwardForm,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const detail = body?.detail || body?.error || `Upstream error (${res.status})`;
      return NextResponse.json({ error: "Transcription failed", detail }, { status: 502 });
    }

    const data = (await res.json()) as { text?: string };
    return NextResponse.json({ text: data.text ?? "" });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Transcription failed", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
