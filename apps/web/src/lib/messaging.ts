// Provider adapters. Email: Resend. SMS: Termii. Keys live in environment variables only.
export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Nigerian numbers to international form without '+': 08012345678 -> 2348012345678 */
export function normalisePhone(raw: string): string | null {
  const d = raw.replace(/[^0-9]/g, "");
  if (/^234\d{10}$/.test(d)) return d;
  if (/^0\d{10}$/.test(d)) return "234" + d.slice(1);
  if (/^\d{10}$/.test(d)) return "234" + d;
  return null;
}

export async function sendEmail(to: string, subject: string, text: string): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY, from = process.env.EMAIL_FROM;
  if (!key || !from) return { ok: false, error: "Email is not configured (RESEND_API_KEY / EMAIL_FROM)." };
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1f2a24">
    <div style="background:#063d24;color:#fff;padding:12px 16px;font-weight:bold">PLASU Student Affairs</div>
    <div style="padding:16px;line-height:1.5"><h2 style="color:#0b5c36;margin-top:0">${escapeHtml(subject)}</h2>
    <p style="white-space:pre-wrap">${escapeHtml(text)}</p></div>
    <div style="padding:12px 16px;font-size:12px;color:#666">You can change your alert preferences on your account page.</div></div>`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text, html }),
  });
  if (r.ok) return { ok: true };
  return { ok: false, error: `Resend ${r.status}: ${(await r.text()).slice(0, 200)}` };
}

export async function sendSms(to: string, text: string): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.TERMII_API_KEY, sender = process.env.TERMII_SENDER_ID;
  if (!key || !sender) return { ok: false, error: "SMS is not configured (TERMII_API_KEY / TERMII_SENDER_ID)." };
  const num = normalisePhone(to);
  if (!num) return { ok: false, error: "Invalid phone number." };
  const r = await fetch("https://api.ng.termii.com/api/sms/send", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ api_key: key, to: num, from: sender, sms: text, type: "plain", channel: process.env.TERMII_CHANNEL || "generic" }),
  });
  if (r.ok) return { ok: true };
  return { ok: false, error: `Termii ${r.status}: ${(await r.text()).slice(0, 200)}` };
}
