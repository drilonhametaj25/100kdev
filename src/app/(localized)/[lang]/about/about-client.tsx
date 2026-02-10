"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import { JsonLd } from "@/components/seo/json-ld";
import { getPersonSchema } from "@/lib/seo/json-ld";
import type { Locale } from "@/i18n/config";

interface AboutPageClientProps {
  lang: Locale;
}

const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Tailwind CSS",
  "React Native",
  "Supabase",
  "Stripe",
  "Vercel",
];

export function AboutPageClient({ lang }: AboutPageClientProps) {
  const { t, language } = useLanguage();

  return (
    <>
      <JsonLd data={getPersonSchema()} />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pt-20 pb-16">
          <div className="max-w-3xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-mono font-bold text-white mb-4">
                {t.aboutTitle}
              </h1>
              <p className="text-xl text-white/60">{t.aboutSubtitle}</p>
            </div>

            {/* Intro */}
            <div className="prose prose-invert max-w-none mb-12">
              <p className="text-lg text-white/80 leading-relaxed">
                {t.aboutIntro}
              </p>
            </div>

            {/* Philosophy */}
            <section className="mb-12">
              <h2 className="text-2xl font-mono font-bold text-white mb-4 border-l-2 border-white/30 pl-4">
                {t.aboutPhilosophyTitle}
              </h2>
              <p className="text-white/70 leading-relaxed pl-4">
                {t.aboutPhilosophyText}
              </p>
            </section>

            {/* Tech Stack */}
            <section className="mb-12">
              <h2 className="text-2xl font-mono font-bold text-white mb-4 border-l-2 border-white/30 pl-4">
                {t.aboutStackTitle}
              </h2>
              <p className="text-white/70 leading-relaxed pl-4 mb-6">
                {t.aboutStackText}
              </p>
              <div className="flex flex-wrap gap-2 pl-4">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm font-mono text-white/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* Experience */}
            <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10 mb-12">
              <p className="text-3xl font-mono font-bold text-white mb-2">
                {t.aboutExperience}
              </p>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-white/60 mb-6">{t.aboutCta}</p>
              <Link href={`/${language}`}>
                <Button size="lg">{t.lockThisPrice}</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
