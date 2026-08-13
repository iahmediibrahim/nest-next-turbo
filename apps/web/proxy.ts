import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_AFTER_LOGIN_URL,
  DEFAULT_AUTH_URL,
  DEFAULT_PUBLIC_HOME_URL,
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "./lib/sessionTokens";

const PUBLIC_ROUTES = new Set<string>([]);

const AUTH_ROUTES = new Set<string>([
  DEFAULT_PUBLIC_HOME_URL,
  "/auth/signin",
  "/auth/signup",
]);

const PUBLIC_FILE_PATTERN =
  /\.(?:js|css|mjs|woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif|ico|webp|avif|map|txt)$/i;

function classifyRoute(pathname: string): "public" | "auth" | "protected" {
  if (PUBLIC_FILE_PATTERN.test(pathname)) return "public";
  if (pathname.startsWith("/_next")) return "public";
  if (pathname.startsWith("/api")) return "public";
  if (PUBLIC_ROUTES.has(pathname)) return "public";
  if (AUTH_ROUTES.has(pathname)) return "auth";
  return "protected";
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const kind = classifyRoute(pathname);
  if (kind === "public") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const hasSession = Boolean(session);

  if (kind === "auth" && hasSession) {
    const next = req.nextUrl.searchParams.get("next");
    const safeNext =
      next && next.startsWith("/") && !next.startsWith("//")
        ? next
        : DEFAULT_AFTER_LOGIN_URL;
    return NextResponse.redirect(new URL(safeNext, req.url));
  }

  if (kind === "protected" && !hasSession) {
    const loginUrl = new URL(DEFAULT_AUTH_URL, req.url);
    const original = search ? `${pathname}${search}` : pathname;
    if (original !== DEFAULT_AUTH_URL) {
      loginUrl.searchParams.set("next", original);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts).*)"],
};
