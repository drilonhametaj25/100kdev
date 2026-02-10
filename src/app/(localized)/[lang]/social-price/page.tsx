"use client";

import { useEffect, useState } from "react";
import { SocialPriceDisplay } from "@/components/social/social-price-display";
import { MetricsDisplay } from "@/components/social/metrics-display";
import { TikTokEmbed } from "@/components/social/tiktok-embed";
import { CountdownTimer } from "@/components/social/countdown-timer";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";
import { useLanguage } from "@/hooks/use-language";
import Link from "next/link";

interface SocialProject {
  id: string;
  title: string;
  description: string;
  tiktokUrl: string;
  tiktokEmbedHtml: string | null;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  calculatedPrice: number;
  floorPrice: number;
  capPrice: number;
  status: string;
  expiresAt: string | null;
}

export default function SocialPricePage() {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<SocialProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<SocialProject | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/social-projects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Failed to fetch social projects:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white/50 font-mono animate-pulse">Loading...</div>
      </main>
    );
  }

  if (projects.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-mono font-bold text-white mb-4">Social Price Mode</h1>
        <p className="text-white/50 mb-8">No social projects available right now.</p>
        <Link href={`/${language}`}>
          <Button variant="secondary">← Back to Counter Mode</Button>
        </Link>
      </main>
    );
  }

  // If a project is selected, show full details
  if (selectedProject) {
    return (
      <main className="min-h-screen p-4 md:p-8 pt-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back to list */}
          <button
            onClick={() => setSelectedProject(null)}
            className="text-white/50 hover:text-white font-mono text-sm transition-colors"
          >
            ← Back to all projects
          </button>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-mono font-bold text-white mb-2">{selectedProject.title}</h1>
            <p className="text-white/60 max-w-xl mx-auto">{selectedProject.description}</p>
          </div>

          {/* Price Display */}
          <SocialPriceDisplay
            price={selectedProject.calculatedPrice}
            floorPrice={selectedProject.floorPrice}
            capPrice={selectedProject.capPrice}
          />

          {/* Countdown Timer */}
          <div className="max-w-md mx-auto">
            <CountdownTimer expiresAt={selectedProject.expiresAt} />
          </div>

          {/* Metrics */}
          <div className="max-w-2xl mx-auto">
            <MetricsDisplay metrics={selectedProject.metrics} />
          </div>

          {/* TikTok Embed */}
          <div className="max-w-md mx-auto">
            <TikTokEmbed
              embedHtml={selectedProject.tiktokEmbedHtml}
              tiktokUrl={selectedProject.tiktokUrl}
            />
          </div>

          {/* Formula explanation */}
          <div className="text-center p-4 bg-white/5 rounded-lg max-w-xl mx-auto">
            <p className="text-sm font-mono text-white/50">
              Price formula: (views × $1) + (likes × $10) + (comments × $50) + (shares × $100)
            </p>
          </div>

          {/* Back link */}
          <div className="text-center">
            <Link href={`/${language}`}>
              <Button variant="ghost">← Back to Counter Mode</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Show all projects as cards
  return (
    <main className="min-h-screen p-4 md:p-8 pt-20">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-block px-3 py-1 bg-price-social/20 rounded-full mb-4">
            <span className="text-price-social font-mono text-sm font-bold">SOCIAL PRICE MODE</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-2">
            Choose a Project
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            The price is determined by TikTok engagement. More views, likes, and shares = higher price.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="p-6 bg-white/5 border border-white/10 rounded-xl text-left hover:bg-white/10 hover:border-price-social/50 transition-all group"
            >
              {/* Title & Status */}
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-mono font-bold text-white group-hover:text-price-social transition-colors">
                  {project.title}
                </h2>
                <span className="text-xs px-2 py-1 bg-price-social/20 text-price-social rounded font-mono">
                  {project.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-white/50 mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-mono font-bold text-price-social">
                  {formatPrice(project.calculatedPrice)}
                </span>
              </div>

              {/* Quick Metrics */}
              <div className="flex items-center gap-4 text-xs text-white/40 font-mono">
                <span>👁 {project.metrics.views.toLocaleString()}</span>
                <span>❤️ {project.metrics.likes.toLocaleString()}</span>
                <span>💬 {project.metrics.comments.toLocaleString()}</span>
              </div>

              {/* View Details hint */}
              <div className="mt-4 text-sm text-price-social/70 group-hover:text-price-social transition-colors">
                View details →
              </div>
            </button>
          ))}
        </div>

        {/* Formula */}
        <div className="text-center p-4 bg-white/5 rounded-lg max-w-xl mx-auto">
          <p className="text-sm font-mono text-white/50">
            Price formula: (views × $1) + (likes × $10) + (comments × $50) + (shares × $100)
          </p>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link href={`/${language}`}>
            <Button variant="ghost">← Back to Counter Mode</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
