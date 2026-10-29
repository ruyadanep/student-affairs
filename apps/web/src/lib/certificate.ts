import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { GREEN, safe, wrap } from "./letter";

export type CertificateInput = { studentName: string; matricNo: string; department: string; faculty: string; session: string; units: { name: string; approvedAt: Date | null }[]; code: string; siteUrl: string; clearedAt: Date };

export async function makeCertificatePdf(i: CertificateInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create(); const page = pdf.addPage([595, 842]);
  const reg = await pdf.embedFont(StandardFonts.Helvetica), bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const W = 595, M = 60; let y = 790;
  try { const logo = await pdf.embedPng(await readFile(path.join(process.cwd(), "public", "logo.png"))); page.drawImage(logo, { x: W / 2 - 35, y: y - 70, width: 70, height: 70 }); y -= 85; } catch { y -= 10; }
  const center = (t: string, f: typeof reg, s: number, color = rgb(0, 0, 0)) => { page.drawText(t, { x: (W - f.widthOfTextAtSize(t, s)) / 2, y, size: s, font: f, color }); y -= s + 6; };
  center("PLATEAU STATE UNIVERSITY, BOKKOS", bold, 16, GREEN); center("Division of Student Affairs", reg, 11, rgb(0.35, 0.4, 0.42));
  page.drawLine({ start: { x: M, y: y - 4 }, end: { x: W - M, y: y - 4 }, thickness: 1.5, color: GREEN }); y -= 34;
  center("CLEARANCE CERTIFICATE", bold, 15, GREEN); y -= 8;
  const who = `${i.studentName} (Matric No. ${i.matricNo || "not on file"}), Department of ${i.department || "not on file"}, ${i.faculty || "Faculty not on file"}`;
  for (const l of wrap(`This is to certify that ${who}, has been cleared by every required unit of Plateau State University, Bokkos, for the ${i.session} session, as listed below.`, reg, 11.5, W - 2 * M)) { page.drawText(l, { x: M, y, size: 11.5, font: reg }); y -= 17; }
  y -= 12; page.drawText("Unit", { x: M, y, size: 10.5, font: bold }); page.drawText("Cleared on", { x: W - M - 120, y, size: 10.5, font: bold }); y -= 6;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6 }); y -= 16;
  i.units.forEach((u, n) => { page.drawText(safe(`${n + 1}. ${u.name}`), { x: M, y, size: 11, font: reg }); page.drawText(u.approvedAt ? u.approvedAt.toDateString() : "-", { x: W - M - 120, y, size: 11, font: reg }); y -= 18; });
  y -= 10; page.drawText(`Issued: ${i.clearedAt.toDateString()}`, { x: M, y, size: 10, font: reg }); page.drawText(`Ref: ${i.code}`, { x: W - M - 120, y, size: 10, font: reg });
  page.drawLine({ start: { x: M, y: 170 }, end: { x: M + 170, y: 170 }, thickness: 0.8 });
  page.drawText("Dean of Student Affairs", { x: M, y: 155, size: 10.5, font: bold }); page.drawText("Plateau State University, Bokkos", { x: M, y: 141, size: 9.5, font: reg });
  const url = `${i.siteUrl}/verify/${i.code}`;
  const qr = await pdf.embedPng(Buffer.from((await QRCode.toDataURL(url, { margin: 1, width: 240 })).split(",")[1], "base64"));
  page.drawImage(qr, { x: W - M - 90, y: 80, width: 90, height: 90 });
  page.drawText("Scan to verify", { x: W - M - 76, y: 68, size: 8.5, font: reg }); page.drawText(safe(url), { x: W - M - 190, y: 56, size: 7, font: reg, color: rgb(0.35, 0.4, 0.42) });
  return pdf.save();
}
