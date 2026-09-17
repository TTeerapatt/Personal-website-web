import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * This site is a single landing page, so every other path is sent back to it.
 *
 * `not-found.tsx` cannot do this on its own: the 404 status is committed before
 * a `redirect()` there takes effect, so the request has to be caught earlier.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") return NextResponse.next();

  // Cloning keeps the configured basePath, which `new URL("/", request.url)`
  // would drop.
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";

  return NextResponse.redirect(url);
}

export const config = {
  // Everything except framework internals and file requests. The extension
  // test is what keeps files served from public/ — robots.txt, sitemap.xml,
  // icons, OG images — from being redirected away.
  matcher: ["/((?!_next/|.*\\.[a-zA-Z0-9]+$).*)"],
};
