import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
const yes = (v?: string) => ["yes", "y", "true", "1"].includes((v ?? "").trim().toLowerCase());
function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) { const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true; else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); cell = ""; if (row.some((x) => x.trim())) rows.push(row); row = []; }
    else cell += c; }
  row.push(cell); if (row.some((x) => x.trim())) rows.push(row); return rows;
}
export async function POST(req: Request) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { csv } = await req.json();
  const rows = parseCsv(String(csv ?? "")); const head = (rows.shift() ?? []).map((h) => h.trim().toLowerCase());
  const col = (n: string) => head.indexOf(n);
  if (col("matric_no") < 0 || col("full_name") < 0) return NextResponse.json({ error: "The first row must include matric_no and full_name columns." }, { status: 400 });
  if (rows.length > 5000) return NextResponse.json({ error: "Import up to 5000 students at a time." }, { status: 400 });
  const get = (r: string[], n: string) => (col(n) >= 0 ? (r[col(n)] ?? "").trim() : "");
  const list: any[] = []; let skipped = 0;
  for (const r of rows) {
    const matric = get(r, "matric_no").toUpperCase(), name = get(r, "full_name");
    if (!matric || !name) { skipped++; continue; }
    const g = get(r, "gender").toLowerCase(), lvl = parseInt(get(r, "level"), 10);
    list.push({ matric_no: matric, full_name: name, email: get(r, "email").toLowerCase() || null, gender: g === "male" || g === "female" ? g : null, faculty: get(r, "faculty") || null, department: get(r, "department") || null, level: Number.isFinite(lvl) ? lvl : null, is_fresh: yes(get(r, "is_fresh")), is_final_year: yes(get(r, "is_final_year")) });
  }
  let imported = 0;
  for (let i = 0; i < list.length; i += 500) {
    const { error } = await db.from("enrolled_students").upsert(list.slice(i, i + 500), { onConflict: "matric_no" }); // row-level security: Dean's office only
    if (error) return NextResponse.json({ error: error.code === "42501" ? "You don't have permission to import students." : "The import stopped part-way. Check the file and try again.", imported }, { status: error.code === "42501" ? 403 : 500 });
    imported += Math.min(500, list.length - i);
  }
  return NextResponse.json({ ok: true, imported, skipped });
}
