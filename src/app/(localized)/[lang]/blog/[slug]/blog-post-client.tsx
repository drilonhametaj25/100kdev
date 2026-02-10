"use client";

import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import { JsonLd } from "@/components/seo/json-ld";
import { getBlogPostSchema } from "@/lib/seo/json-ld";
import type { Locale } from "@/i18n/config";

interface BlogPostClientProps {
  lang: Locale;
  slug: string;
  article: {
    title: string;
    content: string;
    date: string;
    category: string;
  };
}

export function BlogPostClient({ lang, slug, article }: BlogPostClientProps) {
  const { t, language } = useLanguage();

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.trim().split("\n");
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={elements.length} className="text-white/80 leading-relaxed mb-4">
            {currentParagraph.join(" ")}
          </p>
        );
        currentParagraph = [];
      }
    };

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("## ")) {
        flushParagraph();
        elements.push(
          <h2
            key={elements.length}
            className="text-2xl font-mono font-bold text-white mt-8 mb-4"
          >
            {trimmed.slice(3)}
          </h2>
        );
      } else if (trimmed.startsWith("### ")) {
        flushParagraph();
        elements.push(
          <h3
            key={elements.length}
            className="text-xl font-mono font-bold text-white mt-6 mb-3"
          >
            {trimmed.slice(4)}
          </h3>
        );
      } else if (trimmed.startsWith("- **")) {
        flushParagraph();
        const match = trimmed.match(/- \*\*(.+?)\*\*:? (.+)/);
        if (match) {
          elements.push(
            <p key={elements.length} className="text-white/80 mb-2 pl-4">
              <span className="font-bold text-white">{match[1]}</span>
              {match[2] ? `: ${match[2]}` : ""}
            </p>
          );
        }
      } else if (trimmed.startsWith("- ")) {
        flushParagraph();
        elements.push(
          <p key={elements.length} className="text-white/80 mb-2 pl-4">
            • {trimmed.slice(2)}
          </p>
        );
      } else if (trimmed === "") {
        flushParagraph();
      } else {
        currentParagraph.push(trimmed);
      }
    });

    flushParagraph();
    return elements;
  };

  return (
    <>
      <JsonLd
        data={getBlogPostSchema(lang, {
          title: article.title,
          description: article.content.substring(0, 155),
          slug,
          datePublished: article.date,
        })}
      />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pt-20 pb-16">
          <article className="max-w-2xl mx-auto px-4">
            {/* Back link */}
            <Link
              href={`/${language}/blog`}
              className="inline-flex items-center text-white/50 hover:text-white font-mono text-sm mb-8 transition-colors"
            >
              ← {t.blogBack}
            </Link>

            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-mono text-white/40">
                  {article.date}
                </span>
                <span className="text-xs px-2 py-1 bg-white/10 rounded text-white/60 font-mono">
                  {article.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-mono font-bold text-white">
                {article.title}
              </h1>
            </header>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              {renderContent(article.content)}
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
}
