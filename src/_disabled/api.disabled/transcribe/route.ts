import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

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

    const model = process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe";

    const result = await openai.audio.transcriptions.create({
      file,
      model,
      language: typeof language === "string" && language ? language : undefined,
    });

    return NextResponse.json({ text: result.text ?? "" });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Transcription failed", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
