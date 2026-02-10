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

interface FormData {
  scheduledAt: string;
  durationMinutes: number;
  dropPrice: number;
}

const initialFormData: FormData = {
  scheduledAt: "",
  durationMinutes: 60,
  dropPrice: 500,
};

export default function DropsPage() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrops = async () => {
    try {
      const response = await fetch("/api/admin/drops");
      if (response.ok) {
        const data = await response.json();
        setDrops(data.drops || []);
      }
    } catch (err) {
      console.error("Failed to fetch drops:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrops();
  }, []);

  const handleCreate = () => {
    setEditingId(null);
    // Set default scheduled time to 1 hour from now
    const defaultTime = new Date(Date.now() + 60 * 60 * 1000);
    setFormData({
      ...initialFormData,
      scheduledAt: defaultTime.toISOString().slice(0, 16),
    });
    setShowForm(true);
    setError(null);
  };

  const handleEdit = (drop: Drop) => {
    setEditingId(drop.id);
    setFormData({
      scheduledAt: new Date(drop.scheduledAt).toISOString().slice(0, 16),
      durationMinutes: drop.durationMinutes,
      dropPrice: drop.dropPrice,
    });
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this drop?")) return;

    try {
      const response = await fetch(`/api/admin/drops?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchDrops();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete");
      }
    } catch {
      setError("Failed to delete drop");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId
        ? { id: editingId, ...formData }
        : formData;

      const response = await fetch("/api/admin/drops", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData(initialFormData);
        await fetchDrops();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Failed to save drop");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this drop?")) return;

    try {
      const response = await fetch("/api/admin/drops", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "cancelled" }),
      });

      if (response.ok) {
        await fetchDrops();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to cancel");
      }
    } catch {
      setError("Failed to cancel drop");
    }
  };

  if (isLoading) {
    return <div className="text-white/50 font-mono">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-mono font-bold text-white">Flash Drops</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-price-extreme text-white font-mono rounded hover:bg-price-extreme/80 transition-colors"
        >
          Schedule Drop
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 font-mono text-sm">{error}</p>
        </div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
          <h2 className="text-xl font-mono font-bold text-white mb-4">
            {editingId ? "Edit Drop" : "Schedule New Drop"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Scheduled Time */}
              <div>
                <label className="block text-sm font-mono text-white/50 mb-1">
                  Scheduled Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-mono text-white/50 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                  min={1}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
                />
              </div>

              {/* Drop Price */}
              <div>
                <label className="block text-sm font-mono text-white/50 mb-1">
                  Drop Price ($) *
                </label>
                <input
                  type="number"
                  value={formData.dropPrice}
                  onChange={(e) => setFormData({ ...formData, dropPrice: Number(e.target.value) })}
                  min={1}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData(initialFormData);
                }}
                className="px-4 py-2 bg-white/10 text-white font-mono rounded hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-price-extreme text-white font-mono rounded hover:bg-price-extreme/80 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : editingId ? "Update" : "Schedule"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Drops List */}
      {drops.length === 0 ? (
        <p className="text-white/50 font-mono">No drops scheduled. Create one to get started.</p>
      ) : (
        <div className="space-y-4">
          {drops.map((drop) => (
            <div
              key={drop.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono font-bold text-white">
                    {new Date(drop.scheduledAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-white/50 mt-1">
                    Duration: {drop.durationMinutes} minutes
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-price-extreme text-xl">
                    {formatPrice(drop.dropPrice)}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs font-mono rounded ${
                    drop.status === "active" ? "bg-green-500/20 text-green-400" :
                    drop.status === "scheduled" ? "bg-yellow-500/20 text-yellow-400" :
                    drop.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                    "bg-white/10 text-white/50"
                  }`}>
                    {drop.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                {drop.status === "scheduled" && (
                  <>
                    <button
                      onClick={() => handleEdit(drop)}
                      className="px-3 py-1 text-sm bg-white/10 text-white font-mono rounded hover:bg-white/20 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCancel(drop.id)}
                      className="px-3 py-1 text-sm bg-yellow-500/20 text-yellow-400 font-mono rounded hover:bg-yellow-500/30 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(drop.id)}
                  className="px-3 py-1 text-sm bg-red-500/20 text-red-400 font-mono rounded hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
