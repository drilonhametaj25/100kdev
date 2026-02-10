import Link from "next/link";
import { JetBrains_Mono } from "next/font/google";
import "../globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/purchases", label: "Purchases" },
  { href: "/admin/drops", label: "Drops" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/social", label: "Social" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="antialiased">
        <div className="min-h-screen bg-background pt-16">
          {/* Admin Header */}
          <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/admin" className="font-mono font-bold text-white">
                100KDEV Admin
              </Link>
              <nav className="flex items-center gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-mono text-white/60 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/en" className="text-sm font-mono text-white/40 hover:text-white/60">
                  ← Site
                </Link>
              </nav>
            </div>
          </header>

          {/* Content */}
          <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
