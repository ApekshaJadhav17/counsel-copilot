import { NextResponse } from "next/server";
import { LLMError } from "./groq";
import { clientIp, limited } from "./ratelimit";

/** Shared wrapper: rate limit, JSON body, error mapping. */
export async function handle(req: Request, fn: (body: Record<string, unknown>) => Promise<unknown>) {
  if (limited(clientIp(req))) {
    return NextResponse.json({ error: "Too many runs from this device. Wait 10 minutes or use Replay." }, { status: 429 });
  }
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty body */ }
  try {
    return NextResponse.json(await fn(body));
  } catch (e) {
    const status = e instanceof LLMError ? e.status : 500;
    const msg = e instanceof Error ? e.message : "Unexpected error.";
    return NextResponse.json({ error: msg }, { status });
  }
}

export const str = (v: unknown, max: number) => String(v ?? "").slice(0, max);
