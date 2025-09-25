import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

import createIntlMiddleware from "next-intl/middleware";
import { locales } from "./i18n/config";

const defaultLocale = "en";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
});

export async function middleware(request: NextRequest) {
  // Redirect '/en' (or '/en/') to root '/'
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && segments[0] === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Redirect /products and /cart to include locale prefix
  if (segments.length === 1 && (segments[0] === "products" || segments[0] === "cart")) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}/${segments[0]}`;
    return NextResponse.redirect(url);
  }

  if (typeof auth0.middleware === "function") {
    const authResult = await auth0.middleware(request);

    console.log("authResult", authResult);


    if (authResult) {
      return authResult;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
