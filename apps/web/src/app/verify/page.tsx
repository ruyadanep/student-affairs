"use client";
export default function VerifyIndex() {
  function go(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const c = String(new FormData(e.currentTarget).get("code") ?? "").trim().toUpperCase(); if (c) window.location.href = `/verify/${encodeURIComponent(c)}`; }
  return (<main style={{ maxWidth: "30rem" }}><h1>Verify a document</h1>
    <p>Letters and clearance certificates from Student Affairs carry a reference code and a QR code. Scan the QR code, or type the reference code here.</p>
    <form onSubmit={go}><label>Reference code<input className="field" name="code" placeholder="9F3A1C7B2D40" required /></label><button className="btn" type="submit">Check document</button></form></main>);
}
