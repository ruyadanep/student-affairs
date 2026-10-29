import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";
import QRCode from "qrcode";
import { readFile } from "node:fs/promises";
import path from "node:path";

export type LetterInput = { docType: string; studentName: string; matricNo: string; department: string; faculty: string; purpose: string; addressee?: string | null; code: string; siteUrl: string; issuedAt: Date };

export const GREEN = rgb(0.043, 0.361, 0.212);
export const safe = (s: string) => (s ?? "").replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");
const TITLES: Record<string, string> = { good_standing: "LETTER OF GOOD STANDING", character_reference: "CHARACTER REFERENCE", attestation: "ATTESTATION LETTER", other: "STUDENT LETTER" };

// Template wording: the Dean's office should confirm these before go-live.
function body(i: LetterInput): string[] {
  const who = `${i.studentName} (Matric No. ${i.matricNo || "not on file"}), a student of the Department of ${i.department || "not on file"}, ${i.faculty || "Faculty not on file"}`;
  const first = i.docType === "character_reference"
    ? `This is to confirm that ${who}, is a registered student of Plateau State University, Bokkos. The Division of Student Affairs holds no adverse record against the student at the time of writing.`
    : i.docType === "good_standing"
    ? `This is to certify that ${who}, is a registered student of Plateau State University, Bokkos, and is in good standing with the University at the time of writing.`
    : `This is to attest that ${who}, is a registered student of Plateau State University, Bokkos.`;
  return [first, `This letter was issued at the student's request for the following purpose: ${i.purpose}.`, "It is valid only when verified using the QR code or reference below, and should not be accepted without verification."];
}

export function wrap(text: string, font: PDFFont, size: number, max: number) {
  const lines: string[] = []; let line = "";
  for (const w of safe(text).split(/\s+/)) { const t = line ? line + " " + w : w; if (font.widthOfTextAtSize(t, size) > max && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}

export async function makeLetterPdf(i: LetterInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create(); const page = pdf.addPage([595, 842]);
  const reg = await pdf.embedFont(StandardFonts.Helvetica), bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const W = 595, M = 60; let y = 790;
  try { const logo = await pdf.embedPng(await readFile(path.join(process.cwd(), "public", "logo.png"))); page.drawImage(logo, { x: W / 2 - 35, y: y - 70, width: 70, height: 70 }); y -= 85; } catch { y -= 10; }
  const center = (t: string, f: PDFFont, s: number, color = rgb(0, 0, 0)) => { page.drawText(t, { x: (W - f.widthOfTextAtSize(t, s)) / 2, y, size: s, font: f, color }); y -= s + 6; };
  center("PLATEAU STATE UNIVERSITY, BOKKOS", bold, 16, GREEN); center("Division of Student Affairs", reg, 11, rgb(0.35, 0.4, 0.42));
  page.drawLine({ start: { x: M, y: y - 4 }, end: { x: W - M, y: y - 4 }, thickness: 1.5, color: GREEN }); y -= 30;
  page.drawText(`Date: ${i.issuedAt.toDateString()}`, { x: M, y, size: 10, font: reg }); page.drawText(`Ref: ${i.code}`, { x: W - M - 120, y, size: 10, font: reg }); y -= 28;
  page.drawText(safe(i.addressee ? `To: ${i.addressee}` : "To whom it may concern"), { x: M, y, size: 11, font: bold }); y -= 30;
  center(TITLES[i.docType] ?? TITLES.other, bold, 13, GREEN); y -= 10;
  for (const para of body(i)) { for (const l of wrap(para, reg, 11.5, W - 2 * M)) { page.drawText(l, { x: M, y, size: 11.5, font: reg }); y -= 17; } y -= 9; }
  page.drawLine({ start: { x: M, y: 170 }, end: { x: M + 170, y: 170 }, thickness: 0.8 });
  page.drawText("Dean of Student Affairs", { x: M, y: 155, size: 10.5, font: bold }); page.drawText("Plateau State University, Bokkos", { x: M, y: 141, size: 9.5, font: reg });
  const url = `${i.siteUrl}/verify/${i.code}`;
  const qr = await pdf.embedPng(Buffer.from((await QRCode.toDataURL(url, { margin: 1, width: 240 })).split(",")[1], "base64"));
  page.drawImage(qr, { x: W - M - 90, y: 80, width: 90, height: 90 });
  page.drawText("Scan to verify", { x: W - M - 76, y: 68, size: 8.5, font: reg }); page.drawText(safe(url), { x: W - M - 190, y: 56, size: 7, font: reg, color: rgb(0.35, 0.4, 0.42) });
  return pdf.save();
}
