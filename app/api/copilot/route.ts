import { runAgent, type AgentTool } from "@/lib/groq";
import { handle, str } from "@/lib/handle";
import { BENCHMARKS, DANA_CLIENTS, TEMPLATES } from "@/lib/data";
import type { CopilotOut } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const tools: AgentTool[] = [
  {
    name: "check_conflicts",
    description: "Checks the member's current and former client list for any of the given party names. Returns matches with relation and matter. Call this first.",
    parameters: { type: "object", properties: { names: { type: "array", items: { type: "string" } } }, required: ["names"] },
    run: ({ names }) => {
      const list = (Array.isArray(names) ? names : []).map(n => String(n).toLowerCase());
      return { matches: DANA_CLIENTS.filter(c => list.some(n => c.name.toLowerCase().includes(n) || n.includes(c.name.toLowerCase()))) };
    },
  },
  {
    name: "get_rate_benchmarks",
    description: "Returns peer pricing benchmarks (hourly percentiles, subscription median, flat-fee bands) for a practice area and US state. Example practice_area: 'commercial contracts', state: 'NY'.",
    parameters: { type: "object", properties: { practice_area: { type: "string" }, state: { type: "string" } }, required: ["practice_area", "state"] },
    run: ({ practice_area, state }) => {
      const key = `${String(practice_area || "").toLowerCase()}|${String(state || "").toUpperCase()}`;
      return BENCHMARKS[key] || BENCHMARKS["commercial contracts|NY"];
    },
  },
  {
    name: "search_templates",
    description: "Searches the member-vetted template repository. Returns up to 3 templates with id, name, contributor and use count.",
    parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
    run: ({ query }) => {
      const words = String(query || "").toLowerCase().split(/\W+/).filter(Boolean);
      return TEMPLATES.map(t => ({ t, s: words.filter(w => t.name.toLowerCase().includes(w)).length }))
        .sort((a, b) => b.s - a.s || b.t.uses - a.t.uses).slice(0, 3).map(x => x.t);
    },
  },
];

const SYSTEM = `You are a practice assistant for Dana Okafor, a fractional general counsel (Okafor Counsel PLLC, admitted in NY and NJ, standard rate $425/hour). You do intake work and draft for her approval. You never send anything; Dana approves.

Always: 1) call check_conflicts with every party and company named; 2) call get_rate_benchmarks for the matter; 3) call search_templates for a fitting engagement letter; 4) then reply.

Final reply: ONLY a JSON object of this shape:
{"conflict":{"status":"clear"|"caution"|"stop","detail":"1-2 sentences naming any match and the ABA Model Rule that applies"},
 "fee":{"model":"short label","headline":"short price headline like $3,000 flat + $3,500/month","detail":"1-2 sentences citing the benchmark figures you used"},
 "template":{"id":"template id","name":"template name","why":"one sentence"},
 "letter":"engagement letter draft, plain text with numbered sections, under 230 words total, disclose any former-client relationship; open with 'Dear [client first name],' and close with 'Sincerely, Dana Okafor' on its own line and nothing after it; no bracketed placeholders (no [Address], [Phone], [Email], signature lines, or 'Date:' blanks) and no separate acceptance/signature block",
 "email":"short plain-text reply to the client from Dana, under 120 words"}`;

export async function POST(req: Request) {
  return handle(req, async body => {
    const email = str(body.email, 6000);
    return runAgent<CopilotOut>(SYSTEM, `Prospective client email:\n"""${email}"""`, tools);
  });
}
