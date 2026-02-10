"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils/format";
import { useCounter } from "@/hooks/use-counter";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalPurchases: number;
  pendingPurchases: number;
  totalRevenue: number;
  subscriberCount: number;
}

export default function AdminDashboard() {
  const { price, colorConfig } = useCounter();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    // Fetch stats from API
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }

    fetchStats();
  }, []);

  const handleResetCounter = async () => {
    if (!confirm("Are you sure you want to reset the counter to $1,000?")) return;

    try {
      await fetch("/api/admin/counter/reset", { method: "POST" });
      alert("Counter reset!");
    } catch (error) {
      console.error("Failed to reset counter:", error);
      alert("Failed to reset counter");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-mono font-bold text-white">Dashboard</h1>

      {/* Current Price */}
      <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50 font-mono mb-1">Current Price</p>
            <p
              className="text-4xl font-mono font-bold"
              style={{ color: colorConfig.hex }}
            >
              {formatPrice(price)}
            </p>
          </div>
          <Button variant="secondary" onClick={handleResetCounter}>
            Reset Counter
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Purchases"
          value={stats?.totalPurchases ?? "-"}
        />
        <StatCard
          label="Pending"
          value={stats?.pendingPurchases ?? "-"}
          highlight
        />
        <StatCard
          label="Total Revenue"
          value={stats?.totalRevenue ? formatPrice(stats.totalRevenue) : "-"}
        />
        <StatCard
          label="Subscribers"
          value={stats?.subscriberCount ?? "-"}
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-mono font-bold text-white/70">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Schedule Drop</Button>
          <Button variant="secondary">Add Gallery Project</Button>
          <Button variant="secondary">Create Social Project</Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        highlight
          ? "bg-price-high/10 border-price-high/30"
          : "bg-white/5 border-white/10"
      }`}
    >
      <p className="text-sm text-white/50 font-mono mb-1">{label}</p>
      <p
        className={`text-2xl font-mono font-bold ${
          highlight ? "text-price-high" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
