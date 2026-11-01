import { chatJSON } from "@/lib/groq";
import { handle, str } from "@/lib/handle";
import { BENCHMARKS, DIRECTORY } from "@/lib/data";
import type { ScoperOut } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You are the intake agent on a lawyer network's "find counsel" page. Turn a company's request into a structured matter brief and match it to members. You do not give legal advice and charge no fee.

Rules: match only on practice area and bar admission fit; suggest a team when the matter spans areas; budget ranges must come from the benchmarks or be marked as estimates. Give exactly 3 matches, best first, using member ids from the directory.

Reply with ONLY JSON:
{"summary":"2 sentences","practice_areas":["..."],"jurisdictions":["..."],"urgency":"high"|"medium"|"low","engagement_type":"short label","scope_items":["3-5 items"],"budget":[{"item":"...","range":"$x to $y ..."}],"questions":["3 questions a lawyer would ask"],"matches":[{"id":"member id","fit":0-100,"reason":"1 sentence"}],"team_up":"1 sentence or null"}`;

export async function POST(req: Request) {
  return handle(req, async body => {
    const dir = DIRECTORY.map(({ id, name, areas, bars, years, engagements, background }) => ({ id, name, areas, bars, years, engagements, background }));
    const user = `Company request:\n"""${str(body.text, 4000)}"""\n\nMember directory: ${JSON.stringify(dir)}\nPeer pricing benchmarks (illustrative): ${JSON.stringify(BENCHMARKS)}`;
    return chatJSON<ScoperOut>(SYSTEM, user);
  });
}
