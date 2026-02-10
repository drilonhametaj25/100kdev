"use client";

import Link from "next/link";
import { LangToggle } from "./lang-toggle";
import { useLanguage } from "@/hooks/use-language";

export function Header() {
  const { language } = useLanguage();

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

        {/* Language Toggle */}
        <LangToggle />
      </div>
    </header>
  );
}
