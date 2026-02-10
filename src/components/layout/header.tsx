"use client";

import { LangToggle } from "./lang-toggle";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="font-mono text-sm text-white/50 tracking-widest">
          100KDEV
        </div>

        {/* Language Toggle */}
        <LangToggle />
      </div>
    </header>
  );
}
