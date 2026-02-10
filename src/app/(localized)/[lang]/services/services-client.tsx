"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import { JsonLd } from "@/components/seo/json-ld";
import { getServiceSchema } from "@/lib/seo/json-ld";
import type { Locale } from "@/i18n/config";

interface ServicesPageClientProps {
  lang: Locale;
}

export function ServicesPageClient({ lang }: ServicesPageClientProps) {
  const { t, language } = useLanguage();

  const services = [
    { title: t.servicesWebApps, desc: t.servicesWebAppsDesc, icon: "🌐" },
    { title: t.servicesMobile, desc: t.servicesMobileDesc, icon: "📱" },
    { title: t.servicesSaas, desc: t.servicesSaasDesc, icon: "☁️" },
    { title: t.servicesEcommerce, desc: t.servicesEcommerceDesc, icon: "🛒" },
    { title: t.servicesApi, desc: t.servicesApiDesc, icon: "⚡" },
    { title: t.servicesConsulting, desc: t.servicesConsultingDesc, icon: "💡" },
  ];

  return (
    <>
      <JsonLd data={getServiceSchema(lang)} />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-mono font-bold text-white mb-4">
                {t.servicesTitle}
              </h1>
              <p className="text-xl text-white/60">{t.servicesSubtitle}</p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-white/30 transition-colors"
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h2 className="text-xl font-mono font-bold text-white mb-2">
                    {service.title}
                  </h2>
                  <p className="text-white/60 text-sm">{service.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
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
