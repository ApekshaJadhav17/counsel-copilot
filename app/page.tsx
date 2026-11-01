"use client";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_EMAIL, DEFAULT_LAUNCH, DEFAULT_SCOPER, DIRECTORY } from "@/lib/data";
import { REC_COPILOT, REC_LAUNCH, REC_SCOPER } from "@/lib/recorded";
import type { CopilotOut, LaunchOut, ScoperOut, TraceStep } from "@/lib/types";

const VIEWS = [
  { id: "copilot", label: "Client Email to Proposal", tag: "for members" },
  { id: "scoper", label: "Find the Right Lawyer", tag: "for companies" },
  { id: "launch", label: "Start Your Own Firm Planner", tag: "for new lawyers" },
  { id: "architecture", label: "How it plugs in", tag: "tech" },
] as const;
type ViewId = (typeof VIEWS)[number]["id"];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const byId = (id: string) => DIRECTORY.find(m => m.id === id);
const short = (v: unknown) => { const s = JSON.stringify(v); return s.length > 220 ? s.slice(0, 217) + "…" : s; };

async function post<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `Request failed (${r.status}).`);
  return data as T;
}

type Status = { text: string; busy?: boolean; error?: boolean };
function StatusLine({ s }: { s: Status }) {
  return <div className={"status" + (s.error ? " err" : "")}>{s.busy && <span className="spinner" />}<span>{s.text}</span></div>;
}

export default function Home() {
  const [view, setView] = useState<ViewId>("copilot");
  useEffect(() => {
    const read = () => { const h = location.hash.slice(1); setView((VIEWS.find(v => v.id === h)?.id ?? "copilot") as ViewId); };
    read(); window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  return (
    <>
      <div className="wrap">
        <header className="top">
          <div className="eyebrow">Concept for HeyCounsel · Nov 2026</div>
          <h1>Counsel Copilot</h1>
          <p className="lede">Three AI agents that make membership worth more and bring in new members, without taking a cent of legal fees. Each runs live: the server calls an LLM that uses tools over sample community data.</p>
          <div className="meta-row">
            <span className="pill"><span className="dot" />Live: open-source model on Groq</span>
            <span>Every tab also has a recorded run that works offline.</span>
          </div>
        </header>
      </div>
      <nav className="tabs" aria-label="Prototype sections">
        <div className="wrap tabrow">
          {VIEWS.map(v => (
            <a key={v.id} href={`#${v.id}`} aria-current={view === v.id ? "page" : undefined}><span>{v.label}</span><small>{v.tag}</small></a>
          ))}
        </div>
      </nav>
      <main className="wrap content">
        {view === "copilot" && <Copilot />}
        {view === "scoper" && <Scoper />}
        {view === "launch" && <Launch />}
        {view === "architecture" && <Architecture />}
      </main>
      <div className="wrap"><footer>Concept prototype by Apeksha Jadhav (github.com/ApekshaJadhav17). Public figures come from HeyCounsel&apos;s Pulse report and website; people, firms, clients and rate benchmarks are invented for the demo. Not legal advice.</footer></div>
    </>
  );
}

/* ---------------- Client Email to Proposal ---------------- */
function Copilot() {
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [out, setOut] = useState<CopilotOut | null>(null);
  const [status, setStatus] = useState<Status>({ text: "" });
  const [busy, setBusy] = useState(false);

  async function replay() {
    setBusy(true); setOut(null); setTrace([]); setStatus({ text: "Replaying recorded run", busy: true });
    for (const s of REC_COPILOT.trace) { await sleep(700); setTrace(t => [...t, s]); }
    await sleep(500); setOut(REC_COPILOT.out); setStatus({ text: "Recorded run · 3 tool calls · drafts below await approval" }); setBusy(false);
  }
  async function run() {
    setBusy(true); setOut(null); setTrace([]); setStatus({ text: "Agent is checking conflicts, rates and templates…", busy: true });
    try {
      const r = await post<{ trace: TraceStep[]; out: CopilotOut }>("/api/copilot", { email });
      for (const s of r.trace) { setTrace(t => [...t, s]); await sleep(250); }
      setOut(r.out); setStatus({ text: `Live run · ${r.trace.length} tool call${r.trace.length === 1 ? "" : "s"} · drafts below await approval` });
    } catch (e) { setStatus({ text: (e as Error).message, error: true }); }
    setBusy(false);
  }

  return (
    <section>
      <div className="view-head">
        <div>
          <h2>Client Email to Proposal: one email in, fee quote and agreement out</h2>
          <p>Today the HeyCounsel MCP can read. This version acts: it checks conflicts, prices the work against peer benchmarks, picks a member-vetted template and drafts the letter. Nothing goes out until the lawyer approves.</p>
        </div>
        <div className="why">Attacks the 33% of a member&apos;s month spent on admin and business development (Pulse, Summer 2026).</div>
      </div>
      <div className="grid">
        <div className="panel">
          <h3>Incoming request</h3>
          <dl className="persona">
            <dt>Member</dt><dd>Dana Okafor, Okafor Counsel PLLC</dd>
            <dt>Practice</dt><dd>Fractional GC · commercial contracts, health privacy</dd>
            <dt>Bars</dt><dd>New York, New Jersey</dd>
          </dl>
          <label htmlFor="cpEmail">Email from prospective client</label>
          <textarea id="cpEmail" rows={12} value={email} onChange={e => setEmail(e.target.value)} />
          <div className="actions">
            <button className="primary" onClick={run} disabled={busy}>Run live agent</button>
            <button onClick={replay} disabled={busy}>Replay recorded run</button>
          </div>
          <div className="hint">Server-side tools: check_conflicts, get_rate_benchmarks, search_templates, over sample data.</div>
        </div>
        <div className="panel" aria-live="polite">
          <h3>Agent trace</h3>
          <StatusLine s={status} />
          <ol className="trace">
            {trace.map((s, i) => (
              <li className="step" key={i}><span className="n">{i + 1}</span><div><code>{s.tool}({JSON.stringify(s.args)})</code><div className="res">→ {short(s.result)}</div></div></li>
            ))}
          </ol>
          {!out && !busy && trace.length === 0 && <div className="empty">Run the agent or replay the recorded run to see each tool call and the drafts it produces.</div>}
          {out && <CopilotResult o={out} />}
        </div>
      </div>
    </section>
  );
}

function CopilotResult({ o }: { o: CopilotOut }) {
  const st = (o.conflict?.status || "").toLowerCase();
  const cls = st === "clear" ? "ok" : st === "stop" ? "stop" : "warn";
  return (
    <div className="cards">
      <div className={"card " + (cls === "ok" ? "" : cls)}>
        <div className="k">Conflict check <span className={"badge " + cls}>{st || "review"}</span></div>
        <div className="v">{o.conflict?.detail}</div>
      </div>
      <div className="two">
        <div className="card"><div className="k">Fee quote <span className="badge info">{o.fee?.model}</span></div><div className="price">{o.fee?.headline}</div><div className="v">{o.fee?.detail}</div></div>
        <div className="card"><div className="k">Template used <span className="badge info">{o.template?.id}</span></div><div className="v"><strong>{o.template?.name}</strong><div className="hint">{o.template?.why}</div></div></div>
      </div>
      <Draft title="Engagement letter draft" label="letter" text={o.letter} />
      <Draft title="Reply to client" label="reply" text={o.email} />
    </div>
  );
}

function Draft({ title, label, text }: { title: string; label: string; text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [approved, setApproved] = useState(false);
  const [msg, setMsg] = useState("");
  async function copy() {
    const t = ref.current?.innerText || "";
    try { await navigator.clipboard.writeText(t); setMsg("Copied"); } catch { setMsg("Copy failed; select the text manually"); }
  }
  return (
    <div className="card">
      <div className="k">{title} <span className={"badge " + (approved ? "ok" : "warn")}>{approved ? "approved" : "needs approval"}</span></div>
      <div className="v">
        <div ref={ref} className="doc" contentEditable={!approved} suppressContentEditableWarning>{text}</div>
        <div className="actions">
          <button className="primary" disabled={approved} onClick={() => setApproved(true)}>Approve {label}</button>
          <button onClick={copy}>Copy</button>
          {approved ? <span className="approved">Approved by Dana Okafor · queued to send (prototype: nothing is sent)</span> : <span className="hint">{msg}</span>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Find the Right Lawyer ---------------- */
function Scoper() {
  const [text, setText] = useState(DEFAULT_SCOPER);
  const [out, setOut] = useState<ScoperOut | null>(null);
  const [status, setStatus] = useState<Status>({ text: "" });
  const [busy, setBusy] = useState(false);
  async function replay() { setBusy(true); setOut(null); setStatus({ text: "Replaying recorded run", busy: true }); await sleep(900); setOut(REC_SCOPER); setStatus({ text: "Recorded run" }); setBusy(false); }
  async function run() {
    setBusy(true); setOut(null); setStatus({ text: "Scoping the matter and matching members…", busy: true });
    try { setOut(await post<ScoperOut>("/api/scoper", { text })); setStatus({ text: "Live run" }); }
    catch (e) { setStatus({ text: (e as Error).message, error: true }); }
    setBusy(false);
  }
  return (
    <section>
      <div className="view-head">
        <div>
          <h2>Find the Right Lawyer: a company explains its problem, gets matched</h2>
          <p>Replaces the plain intake form on the &quot;Looking for counsel?&quot; page. The agent scopes the matter, sets a budget band from peer pricing and matches it to members, including a team when the matter spans practice areas. No finder&apos;s fee, so no bar-rule exposure.</p>
        </div>
        <div className="why">62% of member revenue comes from referrals. Better-qualified client requests are the perk members value most.</div>
      </div>
      <div className="grid">
        <div className="panel">
          <h3>What the company typed</h3>
          <label htmlFor="scText">Describe what you need</label>
          <textarea id="scText" rows={8} value={text} onChange={e => setText(e.target.value)} />
          <div className="actions">
            <button className="primary" onClick={run} disabled={busy}>Scope and match</button>
            <button onClick={replay} disabled={busy}>Replay recorded run</button>
          </div>
          <div className="hint">Matching runs against a 12-member sample directory.</div>
        </div>
        <div className="panel" aria-live="polite">
          <h3>Matter brief</h3>
          <StatusLine s={status} />
          {!out && !busy && <div className="empty">The brief, budget band and matched lawyers appear here.</div>}
          {out && <ScoperResult d={out} />}
        </div>
      </div>
    </section>
  );
}

function ScoperResult({ d }: { d: ScoperOut }) {
  const urg = String(d.urgency || "").toLowerCase();
  const ucls = urg === "high" ? "stop" : urg === "medium" ? "warn" : "ok";
  return (
    <div className="cards">
      <div className="card">
        <div className="k">Summary <span className={"badge " + ucls}>{urg || "?"} urgency</span></div>
        <div className="v">{d.summary}</div>
        <div className="chips">{(d.practice_areas || []).map(a => <span key={a} className="chip">{a}</span>)}</div>
        <div className="chips">{(d.jurisdictions || []).map(a => <span key={a} className="chip">{a} law</span>)}</div>
      </div>
      <div className="two">
        <div className="card"><div className="k">Scope <span className="badge info">{d.engagement_type}</span></div><ul className="tight">{(d.scope_items || []).map(s => <li key={s}>{s}</li>)}</ul></div>
        <div className="card scroll"><div className="k">Budget band (peer pricing)</div><table className="t"><tbody>{(d.budget || []).map(b => <tr key={b.item}><td>{b.item}</td><td>{b.range}</td></tr>)}</tbody></table></div>
      </div>
      <div className="card">
        <div className="k">Matched members <span className="badge ok">no matching fee</span></div>
        <div className="cards" style={{ marginTop: 10 }}>
          {(d.matches || []).map(m => {
            const p = byId(m.id);
            return (
              <div className="match" key={m.id}>
                <div className="fit">{m.fit}</div>
                <div><h4>{p?.name ?? m.id}</h4><div className="sub">{p ? `${p.firm} · ${p.bars.join(", ")} · ${p.years} yrs · ${p.engagements.join(", ")}` : ""}</div><div className="v">{m.reason}</div></div>
              </div>
            );
          })}
        </div>
        {d.team_up && <p className="note"><strong>Suggested team: </strong>{d.team_up}</p>}
      </div>
      <div className="card"><div className="k">Questions the lawyer will ask</div><ul className="tight">{(d.questions || []).map(q => <li key={q}>{q}</li>)}</ul></div>
    </div>
  );
}

/* ---------------- Start Your Own Firm Planner ---------------- */
function Launch() {
  const [f, setF] = useState(DEFAULT_LAUNCH);
  const [out, setOut] = useState<LaunchOut | null>(null);
  const [status, setStatus] = useState<Status>({ text: "" });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  async function replay() { setBusy(true); setOut(null); setStatus({ text: "Replaying recorded run", busy: true }); await sleep(900); setOut(REC_LAUNCH); setStatus({ text: "Recorded run" }); setBusy(false); }
  async function run() {
    setBusy(true); setOut(null); setStatus({ text: "Building the launch plan…", busy: true });
    try { setOut(await post<LaunchOut>("/api/launch", f)); setStatus({ text: "Live run" }); }
    catch (e) { setStatus({ text: (e as Error).message, error: true }); }
    setBusy(false);
  }
  const fields: [keyof typeof f, string][] = [["background", "Background"], ["bar", "Bar admission"], ["practice", "What you want to practice"], ["clients", "Target clients"], ["goal", "Year-one revenue goal"]];
  return (
    <section>
      <div className="view-head">
        <div>
          <h2>Start Your Own Firm Planner: a free 90-day plan for new solo lawyers</h2>
          <p>A public tool for lawyers about to leave Big Law, in-house or government. It returns positioning, prices drawn from peer benchmarks, a 30/60/90 plan and the members worth meeting. The plan&apos;s last step is joining.</p>
        </div>
        <div className="why">55% of members have run their firm for two years or less. This meets the next ones at the moment they decide.</div>
      </div>
      <div className="grid">
        <div className="panel">
          <h3>About the lawyer</h3>
          {fields.map(([k, label]) => (<div key={k}><label htmlFor={"ln-" + k}>{label}</label><input id={"ln-" + k} value={f[k]} onChange={set(k)} /></div>))}
          <div className="actions">
            <button className="primary" onClick={run} disabled={busy}>Build my launch plan</button>
            <button onClick={replay} disabled={busy}>Replay recorded run</button>
          </div>
        </div>
        <div className="panel" aria-live="polite">
          <h3>Launch plan</h3>
          <StatusLine s={status} />
          {!out && !busy && <div className="empty">Positioning, pricing, a 90-day plan and peer introductions appear here.</div>}
          {out && <LaunchResult d={out} />}
        </div>
      </div>
    </section>
  );
}

function LaunchResult({ d }: { d: LaunchOut }) {
  const p = d.pricing || ({} as LaunchOut["pricing"]);
  const [applied, setApplied] = useState(false);
  return (
    <div className="cards">
      <div className="card"><div className="k">Positioning</div><div className="v">{d.positioning}</div></div>
      <div className="two">
        <div className="card"><div className="k">Subscription</div><div className="price">{p.subscription?.price}</div><div className="v">{p.subscription?.includes}</div></div>
        <div className="card"><div className="k">Hourly (overage)</div><div className="price">{p.hourly?.amount}</div><div className="v">{p.hourly?.note}</div></div>
      </div>
      <div className="card scroll"><div className="k">Flat-fee packages</div><table className="t"><tbody>{(p.flat || []).map(x => <tr key={x.item}><td>{x.item}</td><td>{x.price}</td></tr>)}</tbody></table></div>
      {d.math && <div className="card"><div className="k">Path to the goal</div><div className="v">{d.math}</div></div>}
      <div className="plan">{(d.plan || []).map(w => <div className="card" key={w.window}><h4>{w.window}</h4><ul className="tight">{(w.tasks || []).map(t => <li key={t}>{t}</li>)}</ul></div>)}</div>
      <div className="card"><div className="k">Members worth meeting</div><ul className="tight">{(d.peers || []).map(x => { const m = byId(x.id); return <li key={x.id}><strong>{m?.name ?? x.id}</strong>{m ? ` (${m.areas.slice(0, 2).join(", ")})` : ""}: {x.why}</li>; })}</ul></div>
      <div className="card warn"><div className="k">Watch-outs <span className="badge warn">before day 1</span></div><ul className="tight">{(d.watchouts || []).map(t => <li key={t}>{t}</li>)}</ul></div>
      <div className="actions">
        <button className="primary" onClick={() => setApplied(true)}>Apply to HeyCounsel with this plan</button>
        {applied && <span className="hint">Prototype: this would pre-fill the membership application with the plan above.</span>}
      </div>
    </div>
  );
}

/* ---------------- Architecture ---------------- */
function Architecture() {
  return (
    <section>
      <div className="view-head">
        <div>
          <h2>How it plugs into what HeyCounsel already runs</h2>
          <p>All three agents reuse the data the MCP server already exposes. The new pieces are write tools behind an approval gate, a public intake agent and a public launch agent.</p>
        </div>
      </div>
      <div className="diagram">
        <svg viewBox="0 0 980 470" role="img" aria-label="Three new agents sit on the existing HeyCounsel data and MCP server">
          <defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path className="ah" d="M0 0L10 5L0 10z" /></marker></defs>
          <text className="gl" x="20" y="28">WHO USES IT</text>
          <rect className="bx" x="20" y="40" width="200" height="56" rx="8" /><text className="tt" x="36" y="64">Members</text><text className="ts" x="36" y="82">in Claude, ChatGPT, Grok, Slack</text>
          <rect className="bx" x="20" y="200" width="200" height="56" rx="8" /><text className="tt" x="36" y="224">Client companies</text><text className="ts" x="36" y="242">on the &quot;Looking for counsel?&quot; page</text>
          <rect className="bx" x="20" y="360" width="200" height="56" rx="8" /><text className="tt" x="36" y="384">Lawyers going independent</text><text className="ts" x="36" y="402">on the public site</text>
          <text className="gl" x="290" y="28">AGENTS (NEW)</text>
          <rect className="bx new" x="290" y="40" width="250" height="72" rx="8" /><text className="tt" x="306" y="64">Client Email to Proposal</text><text className="ts" x="306" y="82">write tools: draft letter, quote, proposal</text><text className="ts" x="306" y="98">every write waits for lawyer approval</text>
          <rect className="bx new" x="290" y="192" width="250" height="72" rx="8" /><text className="tt" x="306" y="216">Find the Right Lawyer</text><text className="ts" x="306" y="234">structured brief, budget band</text><text className="ts" x="306" y="250">ranked matches and team-ups</text>
          <rect className="bx new" x="290" y="352" width="250" height="72" rx="8" /><text className="tt" x="306" y="376">Start Your Own Firm Planner</text><text className="ts" x="306" y="394">pricing and 30/60/90 plan</text><text className="ts" x="306" y="410">ends in a membership application</text>
          <rect className="grp" x="610" y="20" width="350" height="430" rx="10" />
          <text className="gl" x="630" y="46">ALREADY BUILT</text>
          <rect className="bx" x="630" y="60" width="310" height="52" rx="8" /><text className="tt" x="646" y="82">HeyCounsel MCP server</text><text className="ts" x="646" y="99">read-only today; add write tools + approval</text>
          <rect className="bx" x="630" y="132" width="148" height="52" rx="8" /><text className="tt" x="646" y="154">Slack archive</text><text className="ts" x="646" y="171">53,385 messages</text>
          <rect className="bx" x="792" y="132" width="148" height="52" rx="8" /><text className="tt" x="808" y="154">Pulse benchmarks</text><text className="ts" x="808" y="171">rates, billing, tools</text>
          <rect className="bx" x="630" y="204" width="148" height="52" rx="8" /><text className="tt" x="646" y="226">Templates</text><text className="ts" x="646" y="243">395 member-vetted</text>
          <rect className="bx" x="792" y="204" width="148" height="52" rx="8" /><text className="tt" x="808" y="226">Directory</text><text className="ts" x="808" y="243">550 lawyers, 64 bars</text>
          <rect className="bx" x="630" y="276" width="310" height="52" rx="8" /><text className="tt" x="646" y="298">Opportunities board</text><text className="ts" x="646" y="315">give and get client work, no fees</text>
          <rect className="bx" x="630" y="348" width="310" height="80" rx="8" /><text className="tt" x="646" y="370">New: guardrails layer</text><text className="ts" x="646" y="388">conflict check before any draft</text><text className="ts" x="646" y="404">audit log of every tool call</text><text className="ts" x="646" y="420">no prompt text stored or trained on</text>
          <path className="ln" d="M220 68H290" markerEnd="url(#ah)" />
          <path className="ln" d="M220 228H290" markerEnd="url(#ah)" />
          <path className="ln" d="M220 388H290" markerEnd="url(#ah)" />
          <path className="ln" d="M540 76H630" markerEnd="url(#ah)" />
          <path className="ln" d="M540 228H585V100H630" markerEnd="url(#ah)" />
          <path className="ln" d="M540 388H595V92H630" markerEnd="url(#ah)" />
        </svg>
      </div>
      <div className="cards" style={{ marginTop: 20 }}>
        <div className="card scroll">
          <div className="k">Build plan, one engineer</div>
          <table className="t">
            <thead><tr><th>Agent</th><th>New pieces</th><th>Effort</th><th>Success signal</th></tr></thead>
            <tbody>
              <tr><td>Client Email to Proposal</td><td>3 write tools on the MCP server, approval queue, conflict-check gate, audit log</td><td>3 to 4 weeks</td><td>Weekly active MCP members; letters approved per member</td></tr>
              <tr><td>Find the Right Lawyer</td><td>Intake agent on the client page, budget bands from Pulse, ranking over the directory</td><td>2 weeks</td><td>Client requests that reach a first call</td></tr>
              <tr><td>Start Your Own Firm Planner</td><td>Public page, plan generator, member-intro suggestions, apply hand-off</td><td>2 weeks</td><td>Plans generated to applications</td></tr>
            </tbody>
          </table>
        </div>
        <div className="two">
          <div className="card"><div className="k">This prototype&apos;s stack</div><div className="v">Next.js 14 App Router + TypeScript · server routes run the agent loop · Groq (open-weight 120B tool-calling model) via its OpenAI-compatible API with tool calling and JSON mode · provider isolated in one file, so moving to Claude is a small change.</div></div>
          <div className="card"><div className="k">Why it grows revenue</div><div className="v">Client Email to Proposal raises retention on the $99 to $129 membership. Find the Right Lawyer improves the referral perk without a finder&apos;s fee. Start Your Own Firm Planner fills the top of the funnel. All three stay clear of fee-sharing rules.</div></div>
        </div>
      </div>
    </section>
  );
}
