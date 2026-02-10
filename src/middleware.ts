import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en", "it"] as const;
const DEFAULT_LOCALE = "en";
const LANGUAGE_COOKIE = "100kdev-lang";

function getPreferredLocale(request: NextRequest): string {
  // 1. Check cookie esistente
  const cookieLang = request.cookies.get(LANGUAGE_COOKIE)?.value;
  if (cookieLang && SUPPORTED_LOCALES.includes(cookieLang as (typeof SUPPORTED_LOCALES)[number])) {
    return cookieLang;
  }

  // 2. Check Accept-Language header del browser
  const acceptLanguage = request.headers.get("accept-language") || "";
  const preferredLang = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
  if (preferredLang === "it") return "it";

  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip per asset statici, API, admin e file con estensione
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.includes(".")
  ) {
    // Mantieni logica admin esistente per protezione
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      const adminSession = request.cookies.get("admin_session");
      if (adminSession) {
        return NextResponse.next();
      }

      const authHeader = request.headers.get("authorization");
      const cronSecret = process.env.CRON_SECRET;

      if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
        return NextResponse.next();
      }

      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  // Check se la path ha gia un prefisso lingua valido
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Estrai la lingua dalla path e setta il cookie
    const locale = pathname.split("/")[1];
    const response = NextResponse.next();
    response.cookies.set(LANGUAGE_COOKIE, locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 anno
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  // Redirect alla versione localizzata
  const locale = getPreferredLocale(request);
  const newPathname = pathname === "/" ? "" : pathname;
  const newUrl = new URL(`/${locale}${newPathname}`, request.url);

  // Mantieni query string
  newUrl.search = request.nextUrl.search;

  return NextResponse.redirect(newUrl, { status: 308 }); // 308 = Permanent Redirect
}

export const config = {
  matcher: [
    // Match tutte le path eccetto file statici e API non-admin
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
