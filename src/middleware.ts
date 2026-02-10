import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Escluci la pagina di login dalla protezione
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Proteggi tutte le rotte /admin e /api/admin
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // Check 1: Cookie di sessione admin (per browser)
    const adminSession = request.cookies.get("admin_session");
    if (adminSession) {
      return NextResponse.next();
    }

    // Check 2: Authorization header con CRON_SECRET (per GitHub Actions)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
      return NextResponse.next();
    }

    // Non autorizzato
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
