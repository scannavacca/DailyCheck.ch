import { NextResponse } from "next/server";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file (field name: file)." }, { status: 400 });
    }

    const name = (file.name || "").toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    if (name.endsWith(".pdf")) {
      const result = await pdfParse(buffer);
      return NextResponse.json({ text: result.text || "" });
    }

    if (name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: result.value || "" });
    }

    if (name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".rtf")) {
      const text = await file.text();
      return NextResponse.json({ text });
    }

    if (name.endsWith(".doc")) {
      return NextResponse.json(
        { error: "DOC format not supported. Please save as .docx or .pdf." },
        { status: 415 }
      );
    }

    return NextResponse.json(
      { error: "Unsupported file type. Use .txt, .pdf, or .docx." },
      { status: 415 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to extract text", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
