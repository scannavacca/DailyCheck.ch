import { NextRequest, NextResponse } from "next/server";

type Item = { code: string; name: string };

function onlyFZ(items: Item[]) {
  return items.filter((x) => x.code.startsWith("F") || x.code.startsWith("Z"));
}

// NLM Clinical Tables ICD-10-CM API base
// Docs: https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search
const BASE = "https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const terms = (url.searchParams.get("terms") || "").trim();
  const code = (url.searchParams.get("code") || "").trim();

  const count = Math.min(Number(url.searchParams.get("count") || 25), 200);
  const offset = Math.max(Number(url.searchParams.get("offset") || 0), 0);

  const effectiveTerms = code || terms;

  if (!effectiveTerms) {
    return NextResponse.json(
      { error: "Provide ?terms=... (search) or ?code=... (exact-ish lookup)." },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    sf: "code,name",
    df: "code,name",
    terms: effectiveTerms,
    count: String(count),
    offset: String(offset),
    q: "code:(F* OR Z*)",
  });

  const apiUrl = `${BASE}?${params.toString()}`;

  const r = await fetch(apiUrl, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!r.ok) {
    const text = await r.text().catch(() => "");
    return NextResponse.json(
      { error: `ICD API request failed (${r.status}).`, details: text.slice(0, 500) },
      { status: 502 }
    );
  }

  const data = (await r.json()) as any[];
  const total = Number(data?.[0] ?? 0);
  const displayRows: any[] = Array.isArray(data?.[3]) ? data[3] : [];

  const items: Item[] = displayRows
    .map((row: any) => {
      const c = String(row?.[0] ?? "");
      const name = String(row?.[1] ?? "");
      return { code: c, name };
    })
    .filter((x: Item) => x.code && x.name);

  const filtered = onlyFZ(items);

  if (code) {
    const exact = filtered.find((x) => x.code === code);
    return NextResponse.json({
      query: { code },
      total,
      item: exact ?? null,
      items: filtered.slice(0, 10),
      source: "clinicaltables.nlm.nih.gov",
    });
  }

  return NextResponse.json({
    query: { terms: effectiveTerms, count, offset },
    total,
    items: filtered,
    source: "clinicaltables.nlm.nih.gov",
  });
}
