"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}

export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-24 pb-12 px-4">
        <article className="max-w-3xl mx-auto">
          <Link href="/" className="inline-block mb-8">
            <Button variant="ghost" size="sm" className="text-white/50">
              &larr; {t.backToHome}
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-4">
            {title}
          </h1>

          {lastUpdated && (
            <p className="text-sm font-mono text-white/40 mb-8">{lastUpdated}</p>
          )}

          <div className="space-y-8">{children}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-mono font-bold text-white mb-3">{title}</h2>
      <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
        {children}
      </div>
    </section>
  );
}
