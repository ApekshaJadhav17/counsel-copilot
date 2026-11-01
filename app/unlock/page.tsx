"use client";
import { useState } from "react";

export default function Unlock() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const r = await fetch("/api/unlock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ passcode: code }) });
    setBusy(false);
    if (r.ok) window.location.href = "/";
    else setErr((await r.json().catch(() => ({}))).error || "That passcode isn't right.");
  }
  return (
    <main className="unlock">
      <form onSubmit={submit} className="panel unlock-card">
        <div className="eyebrow">Concept prototype</div>
        <h1>Counsel Copilot</h1>
        <p className="muted">Enter the passcode Apeksha shared with you.</p>
        <label htmlFor="pc">Passcode</label>
        <input id="pc" type="password" value={code} onChange={e => setCode(e.target.value)} autoFocus />
        <div className="actions"><button className="primary" disabled={busy || !code}>{busy ? "Checking…" : "Open prototype"}</button></div>
        {err && <p className="err">{err}</p>}
      </form>
    </main>
  );
}
