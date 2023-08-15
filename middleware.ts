import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// adding CSP to middleware example from https://nextjs.org/docs/app/building-your-application/routing/middleware#example

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  let cspValue =
    "default-src 'self'; " +
    "frame-ancestors 'none'; " +
    "form-action 'self'; " +
    "base-uri 'self'; " +
    "object-src 'none'; " +
    "style-src 'self' 'unsafe-inline'; " +
    `script-src 'self' 'unsafe-inline' https: http:${
      process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""
    }`;
  const nonce = crypto.randomUUID();

  cspValue += ` 'nonce-${nonce}' 'strict-dynamic'`;

  requestHeaders.set("content-security-policy", cspValue);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("content-security-policy", cspValue);

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*",
};
