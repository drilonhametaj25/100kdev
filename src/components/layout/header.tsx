"use client";

import Link from "next/link";
import { LangToggle } from "./lang-toggle";
import { MobileMenu } from "./mobile-menu";
import { useLanguage } from "@/hooks/use-language";

export function Header() {
  const { language, t } = useLanguage();

  const navLinks = [
    { href: `/${language}/about`, label: t.navAbout },
    { href: `/${language}/services`, label: t.navServices },
    { href: `/${language}/pricing`, label: t.navPricing },
    { href: `/${language}/blog`, label: t.navBlog },
    { href: `/${language}/contact`, label: t.navContact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand - linked to home */}
        <Link
          href={`/${language}`}
          className="font-mono text-sm text-white/50 tracking-widest hover:text-white transition-colors"
        >
          100KDEV
        </Link>

        {/* Desktop Navigation - hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-sm text-white/50 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: Language Toggle + Mobile Menu */}
        <div className="flex items-center gap-4">
          <LangToggle />
          {/* Mobile Menu - hidden on desktop */}
          <MobileMenu className="md:hidden" />
        </div>
      </div>
    </header>
  );
}
