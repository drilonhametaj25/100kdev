"use client";

import { useEffect, useState } from "react";
import { GalleryCard } from "./gallery-card";
import { useLanguage } from "@/hooks/use-language";

interface GalleryProject {
  id: string;
  title: string;
  description: string | null;
  pricePaid: number;
  projectUrl: string | null;
  screenshotUrl: string | null;
  createdAt: string;
}

export function GalleryGrid() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch("/api/gallery");
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGallery();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-white/5 border border-white/10 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-white/40 font-mono">
        No projects yet. Be the first!
      </div>
    );
  }

  return (
    <section className="w-full max-w-2xl mx-auto mt-16">
      <h2 className="text-xl font-mono font-bold text-white/70 mb-6">
        {t.galleryTitle}
      </h2>
      <div className="space-y-3">
        {projects.map((project, index) => (
          <GalleryCard
            key={project.id}
            index={projects.length - index}
            title={project.title}
            description={project.description}
            pricePaid={project.pricePaid}
            projectUrl={project.projectUrl}
          />
        ))}
      </div>
    </section>
  );
}
