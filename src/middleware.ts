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
    // Check cookie di sessione admin
    const adminSession = request.cookies.get("admin_session");

    if (!adminSession) {
      // Redirect a login per pagine, 401 per API
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
