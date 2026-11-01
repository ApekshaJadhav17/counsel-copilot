import { NextResponse, type NextRequest } from "next/server";

// Passcode gate. If DEMO_PASSCODE is unset, the app is open (local dev).
export function middleware(req: NextRequest) {
  const pass = process.env.DEMO_PASSCODE;
  if (!pass) return NextResponse.next();
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/unlock") || pathname.startsWith("/api/unlock")) return NextResponse.next();
  if (req.cookies.get("demo_pass")?.value === pass) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Locked. Enter the passcode first." }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
