"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils/format";

interface GalleryProject {
  id: string;
  title: string;
  description: string | null;
  pricePaid: number;
  isVisible: boolean;
}

export default function GalleryAdminPage() {
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/admin/gallery");
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

    fetchProjects();
  }, []);

  if (isLoading) {
    return <div className="text-white/50 font-mono">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-mono font-bold text-white">Gallery</h1>
        <button className="px-4 py-2 bg-white text-black font-mono rounded">
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-white/50 font-mono">No gallery projects.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="font-mono font-bold text-white">{project.title}</p>
                {project.description && (
                  <p className="text-sm text-white/50">{project.description}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-price-low">
                  {formatPrice(project.pricePaid)}
                </p>
                <span className={`text-xs ${project.isVisible ? "text-price-low" : "text-white/30"}`}>
                  {project.isVisible ? "visible" : "hidden"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
