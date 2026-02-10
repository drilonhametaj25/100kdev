"use client";

import { useLanguage } from "@/hooks/use-language";

export function LangToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      <button
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 rounded transition-colors ${
          language === "en"
            ? "text-white bg-white/10"
            : "text-white/40 hover:text-white/70"
        }`}
      >
        EN
      </button>
      <span className="text-white/20">/</span>
      <button
        onClick={() => setLanguage("it")}
        className={`px-2 py-1 rounded transition-colors ${
          language === "it"
            ? "text-white bg-white/10"
            : "text-white/40 hover:text-white/70"
        }`}
      >
        IT
      </button>
    </div>
  );
}
