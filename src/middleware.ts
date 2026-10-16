import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

const API_URL = process.env.API_URL ?? "http://localhost:8000";
const ADMIN_PATHS = ["/traceability", "/monitoring", "/employees"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/login") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const me = await fetch(`${API_URL}/api/auth/me`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!me.ok) {
    const redirect = NextResponse.redirect(new URL("/login", request.url));
    redirect.cookies.delete(SESSION_COOKIE);
    return redirect;
  }

  const user = (await me.json()) as { role?: string };
  if (ADMIN_PATHS.some((path) => pathname.startsWith(path)) && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
