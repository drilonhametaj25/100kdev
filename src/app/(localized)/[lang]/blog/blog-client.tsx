"use client";

import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import type { Locale } from "@/i18n/config";

interface BlogPageClientProps {
  lang: Locale;
}

// Blog articles data - can be moved to a CMS later
const articles = {
  en: [
    {
      slug: "why-counter-pricing",
      title: "Why I Created a Counter-Based Pricing Model",
      excerpt:
        "Fixed quotes try to predict the future. The counter model creates a fair, transparent market where timing matters.",
      date: "2026-01-15",
      category: "Philosophy",
    },
    {
      slug: "psychology-dynamic-pricing",
      title: "The Psychology Behind Dynamic Pricing",
      excerpt:
        "How scarcity, urgency, and transparency change the way people value services.",
      date: "2026-01-22",
      category: "Insights",
    },
    {
      slug: "flash-drop-accessible",
      title: "Flash Drop: Making Premium Services Accessible",
      excerpt:
        "Why I drop my price to $100 once a month, and how it benefits everyone.",
      date: "2026-02-01",
      category: "Philosophy",
    },
    {
      slug: "tech-stack-behind-counter",
      title: "Building 100KDEV: The Tech Stack Behind the Counter",
      excerpt:
        "A deep dive into Next.js, Supabase, Stripe, and the architecture that powers real-time pricing.",
      date: "2026-02-05",
      category: "Technical",
    },
    {
      slug: "social-price-tiktok",
      title: "Social Price Mode: When TikTok Sets Your Rate",
      excerpt:
        "How engagement metrics became a pricing mechanism, and why it creates unique opportunities.",
      date: "2026-02-08",
      category: "Features",
    },
    {
      slug: "counter-teaches-value",
      title: "From $1,000 to $100,000: What the Counter Teaches About Value",
      excerpt:
        "Lessons learned from watching thousands of people interact with dynamic pricing.",
      date: "2026-02-10",
      category: "Insights",
    },
    {
      slug: "what-to-expect-after-locking",
      title: "What to Expect After Locking Your Price",
      excerpt:
        "A complete guide to the process: from deposit to project delivery.",
      date: "2026-02-12",
      category: "Guide",
    },
    {
      slug: "is-100kdev-right-for-you",
      title: "Is 100KDEV Right for Your Project?",
      excerpt:
        "Honest criteria to help you decide if this unconventional approach fits your needs.",
      date: "2026-02-14",
      category: "Guide",
    },
    {
      slug: "real-time-updates-nextjs-supabase",
      title: "Real-time Price Updates with Next.js and Supabase",
      excerpt:
        "Technical tutorial: How to build a live counter that syncs across all users.",
      date: "2026-02-18",
      category: "Technical",
    },
  ],
  it: [
    {
      slug: "why-counter-pricing",
      title: "Perche Ho Creato un Modello di Pricing a Contatore",
      excerpt:
        "I preventivi fissi cercano di predire il futuro. Il modello del contatore crea un mercato equo e trasparente dove il tempismo conta.",
      date: "2026-01-15",
      category: "Filosofia",
    },
    {
      slug: "psychology-dynamic-pricing",
      title: "La Psicologia Dietro il Pricing Dinamico",
      excerpt:
        "Come scarsita, urgenza e trasparenza cambiano il modo in cui le persone valutano i servizi.",
      date: "2026-01-22",
      category: "Approfondimenti",
    },
    {
      slug: "flash-drop-accessible",
      title: "Flash Drop: Rendere Accessibili Servizi Premium",
      excerpt:
        "Perche abbasso il prezzo a $100 una volta al mese, e come questo beneficia tutti.",
      date: "2026-02-01",
      category: "Filosofia",
    },
    {
      slug: "tech-stack-behind-counter",
      title: "Costruire 100KDEV: Lo Stack Tecnologico Dietro il Contatore",
      excerpt:
        "Un'analisi approfondita di Next.js, Supabase, Stripe e l'architettura che alimenta il pricing in tempo reale.",
      date: "2026-02-05",
      category: "Tecnico",
    },
    {
      slug: "social-price-tiktok",
      title: "Social Price Mode: Quando TikTok Decide la Tua Tariffa",
      excerpt:
        "Come le metriche di engagement sono diventate un meccanismo di pricing, e perche crea opportunita uniche.",
      date: "2026-02-08",
      category: "Funzionalita",
    },
    {
      slug: "counter-teaches-value",
      title: "Da $1.000 a $100.000: Cosa Insegna il Contatore sul Valore",
      excerpt:
        "Lezioni apprese osservando migliaia di persone interagire con il pricing dinamico.",
      date: "2026-02-10",
      category: "Approfondimenti",
    },
    {
      slug: "what-to-expect-after-locking",
      title: "Cosa Aspettarsi Dopo Aver Bloccato il Prezzo",
      excerpt:
        "Una guida completa al processo: dalla caparra alla consegna del progetto.",
      date: "2026-02-12",
      category: "Guida",
    },
    {
      slug: "is-100kdev-right-for-you",
      title: "100KDEV e Giusto per il Tuo Progetto?",
      excerpt:
        "Criteri onesti per aiutarti a decidere se questo approccio non convenzionale fa per te.",
      date: "2026-02-14",
      category: "Guida",
    },
    {
      slug: "real-time-updates-nextjs-supabase",
      title: "Aggiornamenti Prezzo in Tempo Reale con Next.js e Supabase",
      excerpt:
        "Tutorial tecnico: Come costruire un contatore live che si sincronizza tra tutti gli utenti.",
      date: "2026-02-18",
      category: "Tecnico",
    },
  ],
};

export function BlogPageClient({ lang }: BlogPageClientProps) {
  const { t, language } = useLanguage();
  const blogArticles = articles[lang] || articles.en;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-mono font-bold text-white mb-4">
              {t.blogTitle}
            </h1>
            <p className="text-xl text-white/60">{t.blogSubtitle}</p>
          </div>

          {/* Articles */}
          {blogArticles.length === 0 ? (
            <p className="text-center text-white/50">{t.blogNoArticles}</p>
          ) : (
            <div className="space-y-6">
              {blogArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/${language}/blog/${article.slug}`}
                  className="block p-6 bg-white/5 border border-white/10 rounded-xl hover:border-white/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-white/40">
                      {article.date}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded text-white/60 font-mono">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-mono font-bold text-white mb-2 group-hover:text-price-low transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-white/60 text-sm mb-4">{article.excerpt}</p>
                  <span className="text-price-low font-mono text-sm">
                    {t.blogReadMore} →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
