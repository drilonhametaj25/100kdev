"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils/format";

interface Drop {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  dropPrice: number;
  status: string;
}

export default function DropsPage() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDrops() {
      try {
        const response = await fetch("/api/admin/drops");
        if (response.ok) {
          const data = await response.json();
          setDrops(data.drops || []);
        }
      } catch (error) {
        console.error("Failed to fetch drops:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDrops();
  }, []);

  if (isLoading) {
    return <div className="text-white/50 font-mono">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-mono font-bold text-white">Flash Drops</h1>
        <button className="px-4 py-2 bg-price-extreme text-white font-mono rounded">
          Schedule Drop
        </button>
      </div>

      {drops.length === 0 ? (
        <p className="text-white/50 font-mono">No drops scheduled.</p>
      ) : (
        <div className="space-y-4">
          {drops.map((drop) => (
            <div
              key={drop.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="font-mono font-bold text-white">
                  {new Date(drop.scheduledAt).toLocaleString()}
                </p>
                <p className="text-sm text-white/50">
                  {drop.durationMinutes} minutes at {formatPrice(drop.dropPrice)}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-mono rounded ${
                drop.status === "active" ? "bg-price-low/20 text-price-low" :
                drop.status === "scheduled" ? "bg-price-high/20 text-price-high" :
                "bg-white/10 text-white/50"
              }`}>
                {drop.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
