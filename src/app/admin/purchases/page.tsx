"use client";

import { useEffect, useState } from "react";
import { formatPrice, formatRelativeTime } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";

interface Purchase {
  id: string;
  priceLocked: number;
  depositAmount: number;
  customerName: string;
  customerEmail: string;
  projectDescription: string;
  status: string;
  createdAt: string;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const response = await fetch("/api/admin/purchases");
        if (response.ok) {
          const data = await response.json();
          setPurchases(data.purchases || []);
        }
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPurchases();
  }, []);

  const handleAction = async (purchaseId: string, action: "accept" | "reject") => {
    try {
      await fetch(`/api/admin/purchases/${purchaseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      // Refresh list
      const response = await fetch("/api/admin/purchases");
      if (response.ok) {
        const data = await response.json();
        setPurchases(data.purchases || []);
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  if (isLoading) {
    return <div className="text-white/50 font-mono">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-mono font-bold text-white">Purchases</h1>

      {purchases.length === 0 ? (
        <p className="text-white/50 font-mono">No purchases yet.</p>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-mono font-bold text-white">
                      {purchase.customerName}
                    </span>
                    <StatusBadge status={purchase.status} />
                  </div>
                  <p className="text-sm text-white/50 mb-1">{purchase.customerEmail}</p>
                  <p className="text-sm text-white/70 mb-2">{purchase.projectDescription}</p>
                  <p className="text-xs text-white/30">
                    {formatRelativeTime(purchase.createdAt)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-mono font-bold text-price-low">
                    {formatPrice(purchase.priceLocked)}
                  </p>
                  <p className="text-sm text-white/40">
                    Deposit: {formatPrice(purchase.depositAmount)}
                  </p>

                  {purchase.status === "deposit_paid" && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleAction(purchase.id, "accept")}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAction(purchase.id, "reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-white/10 text-white/50",
    deposit_paid: "bg-price-high/20 text-price-high",
    accepted: "bg-price-low/20 text-price-low",
    rejected: "bg-price-extreme/20 text-price-extreme",
    refunded: "bg-white/10 text-white/50",
    completed: "bg-price-medium/20 text-price-medium",
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-mono rounded ${colors[status] || colors.pending}`}>
      {status}
    </span>
  );
}
