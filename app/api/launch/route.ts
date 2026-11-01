import { chatJSON } from "@/lib/groq";
import { handle, str } from "@/lib/handle";
import { BENCHMARKS, DIRECTORY, PUBLIC_PULSE } from "@/lib/data";
import type { LaunchOut } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You help lawyers who are leaving a large firm, in-house role or government job launch an independent practice. Write a practical launch plan. Not legal advice; be concrete.

Prices must be anchored on the benchmarks. The revenue math must add up to the goal. The last task of days 61-90 is applying to the HeyCounsel community. Give exactly 3 peers (member ids from the list) and 3 flat-fee packages.

Reply with ONLY JSON:
{"positioning":"1 sentence","pricing":{"hourly":{"amount":"$x/hour","note":"1 sentence"},"flat":[{"item":"...","price":"$x"}],"subscription":{"price":"$x/month","includes":"short"}},"math":"1 sentence showing how the prices reach the goal","plan":[{"window":"Days 1 to 30","tasks":["4 tasks"]},{"window":"Days 31 to 60","tasks":["4 tasks"]},{"window":"Days 61 to 90","tasks":["4 tasks"]}],"peers":[{"id":"member id","why":"1 sentence"}],"watchouts":["3 items"]}`;

export async function POST(req: Request) {
  return handle(req, async body => {
    const profile = {
      background: str(body.background, 300), bar: str(body.bar, 100), practice: str(body.practice, 300),
      clients: str(body.clients, 300), goal: str(body.goal, 50),
    };
    const user = `Lawyer: ${JSON.stringify(profile)}\n${PUBLIC_PULSE}\nPeer pricing benchmarks (illustrative): ${JSON.stringify(BENCHMARKS)}\nCommunity members they could meet: ${JSON.stringify(DIRECTORY.map(({ id, name, areas, bars }) => ({ id, name, areas, bars })))}`;
    return chatJSON<LaunchOut>(SYSTEM, user);
  });
}
