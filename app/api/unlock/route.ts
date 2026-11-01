import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { passcode } = await req.json().catch(() => ({ passcode: "" }));
  const pass = process.env.DEMO_PASSCODE;
  if (!pass || passcode !== pass) {
    return NextResponse.json({ error: "That passcode isn't right." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("demo_pass", pass, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 14 });
  return res;
}
