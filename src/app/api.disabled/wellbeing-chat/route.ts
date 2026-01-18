import { NextResponse } from "next/server";
import { looksLikePatientCare, patientCareRefusalMessage } from "@/lib/safetyGuards";
import { openai } from "@/lib/openai";

export const runtime = "nodejs";

type ChatMsg = { role: "user" | "assistant"; content: string };

const SYSTEM_POLICY = `
You are a private wellbeing assistant for licensed clinicians, used ONLY for the clinician's own health and wellbeing.

Strict rules (must follow):
- DO NOT assist with patient care. No patient-specific advice. No diagnosis, risk assessment, case formulation, or treatment recommendations for patients.
- If the user asks about a patient, refuse and remind them this tool is not for patient care.
- For the clinician's own health: provide general educational information, stress management, sleep hygiene, burnout prevention, habit formation,
  and guidance on when to seek in-person professional care.
- Do not claim to be a doctor. Do not provide diagnoses or prescriptions.
- If urgent danger is mentioned (self-harm intent, chest pain, severe symptoms), advise seeking urgent local help immediately.

Style:
- Be concise, practical, and supportive.
- Ask clarifying questions only about the user's personal situation (not about any patient).
`;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: ChatMsg[] };
    const msgs = body.messages ?? [];

    const lastUser = [...msgs].reverse().find((m) => m.role === "user")?.content ?? "";
    if (!lastUser) return NextResponse.json({ error: "No user message." }, { status: 400 });

    if (looksLikePatientCare(lastUser)) {
      return NextResponse.json({ reply: patientCareRefusalMessage() });
    }

    const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
    const input = [
      { role: "system" as const, content: SYSTEM_POLICY },
      ...msgs.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    const response = await openai.responses.create({
      model,
      input,
    });

    const text = (response as any).output_text ?? "";
    return NextResponse.json({ reply: text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error." }, { status: 500 });
  }
}
