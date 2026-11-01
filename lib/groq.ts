// Minimal Groq client (OpenAI-compatible chat completions) with a tool-calling loop.
// Swap this file to change providers; the routes only use chatJSON and runAgent.

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

type Msg =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };
type ToolCall = { id: string; type: "function"; function: { name: string; arguments: string } };

export type AgentTool = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  run: (args: Record<string, unknown>) => unknown;
};

export class LLMError extends Error {
  constructor(message: string, public status = 500) { super(message); }
}

function model() { return process.env.GROQ_MODEL || "llama-3.3-70b-versatile"; }

async function call(body: Record<string, unknown>) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new LLMError("GROQ_API_KEY is not set on the server.", 500);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: model(), temperature: 0.3, ...body }),
  });
  if (res.status === 429) throw new LLMError("Groq free-tier limit reached. Wait a minute and try again.", 429);
  if (!res.ok) throw new LLMError(`Groq error ${res.status}: ${(await res.text()).slice(0, 300)}`, 502);
  const data = await res.json();
  return data.choices?.[0]?.message as { content: string | null; tool_calls?: ToolCall[] };
}

/** Tolerant JSON parse: whole text, a fenced block, or first { to last }. */
export function parseJSON<T>(text: string | null | undefined): T | null {
  if (!text) return null;
  const tries = [text, text.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1], text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)];
  for (const t of tries) { if (!t) continue; try { return JSON.parse(t) as T; } catch { /* next */ } }
  return null;
}

/** One call in JSON mode. */
export async function chatJSON<T>(system: string, user: string): Promise<T> {
  const msg = await call({
    messages: [{ role: "system", content: system }, { role: "user", content: user }],
    response_format: { type: "json_object" },
  });
  const out = parseJSON<T>(msg?.content);
  if (!out) throw new LLMError("The model's answer was not valid JSON. Try again.", 502);
  return out;
}

/** Tool-calling loop. Returns the trace of tool calls and the final JSON. */
export async function runAgent<T>(system: string, user: string, tools: AgentTool[], maxRounds = 5) {
  const messages: Msg[] = [{ role: "system", content: system }, { role: "user", content: user }];
  const trace: { tool: string; args: unknown; result: unknown }[] = [];
  const spec = tools.map(t => ({ type: "function", function: { name: t.name, description: t.description, parameters: t.parameters } }));

  for (let round = 0; round < maxRounds; round++) {
    const msg = await call({ messages, tools: spec, tool_choice: "auto" });
    if (msg?.tool_calls?.length) {
      messages.push({ role: "assistant", content: msg.content ?? null, tool_calls: msg.tool_calls });
      for (const tc of msg.tool_calls) {
        const tool = tools.find(t => t.name === tc.function.name);
        let args: Record<string, unknown> = {};
        try { args = JSON.parse(tc.function.arguments || "{}"); } catch { /* keep {} */ }
        let result: unknown;
        try { result = tool ? tool.run(args) : { error: `Unknown tool ${tc.function.name}` }; }
        catch (e) { result = { error: String(e) }; }
        trace.push({ tool: tc.function.name, args, result });
        messages.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result).slice(0, 8000) });
      }
      continue;
    }
    const out = parseJSON<T>(msg?.content);
    if (out) return { trace, out };
    break; // model answered in prose; fall through to a JSON-mode finish
  }

  // Finish: ask once more, no tools, JSON mode, with everything gathered so far.
  messages.push({ role: "user", content: "Now reply with ONLY the JSON object in the required shape." });
  const fin = await call({ messages, response_format: { type: "json_object" } });
  const out = parseJSON<T>(fin?.content);
  if (!out) throw new LLMError("The model's final answer was not valid JSON. Try again.", 502);
  return { trace, out };
}
