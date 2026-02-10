"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils/format";

interface SocialProject {
  id: string;
  title: string;
  description: string;
  tiktok_url: string;
  tiktok_embed_html: string | null;
  floor_price: number;
  cap_price: number;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  calculated_price: number;
  is_active: boolean;
  status: string;
  expires_at: string | null;
  duration_hours: number;
  created_at: string;
}

interface FormData {
  title: string;
  description: string;
  tiktokUrl: string;
  tiktokEmbedHtml: string;
  floorPrice: number;
  capPrice: number;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  durationHours: number;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  tiktokUrl: "",
  tiktokEmbedHtml: "",
  floorPrice: 500,
  capPrice: 50000,
  viewsCount: 0,
  likesCount: 0,
  commentsCount: 0,
  sharesCount: 0,
  savesCount: 0,
  durationHours: 48,
};

export default function SocialAdminPage() {
  const [projects, setProjects] = useState<SocialProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [refreshingAll, setRefreshingAll] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/social");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to fetch social projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setShowForm(true);
    setError(null);
  };

  const handleEdit = (project: SocialProject) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      tiktokUrl: project.tiktok_url,
      tiktokEmbedHtml: project.tiktok_embed_html || "",
      floorPrice: project.floor_price,
      capPrice: project.cap_price,
      viewsCount: project.views_count,
      likesCount: project.likes_count,
      commentsCount: project.comments_count,
      sharesCount: project.shares_count,
      savesCount: project.saves_count,
      durationHours: project.duration_hours || 48,
    });
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/admin/social?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProjects();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete");
      }
    } catch {
      setError("Failed to delete project");
    }
  };

  const handleRefresh = async (id: string) => {
    setRefreshingId(id);
    setError(null);

    try {
      const response = await fetch("/api/admin/social/fetch-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await fetchProjects();
      } else {
        setError(data.error || "Failed to fetch metrics from TikTok");
      }
    } catch {
      setError("Failed to refresh metrics");
    } finally {
      setRefreshingId(null);
    }
  };

  const handleRefreshAll = async () => {
    setRefreshingAll(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/social/fetch-metrics");
      const data = await response.json();

      if (response.ok && data.success) {
        await fetchProjects();
        alert(`Refreshed ${data.updated}/${data.total} projects`);
      } else {
        setError(data.error || "Failed to refresh all projects");
      }
    } catch {
      setError("Failed to refresh all projects");
    } finally {
      setRefreshingAll(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...formData } : formData;

      const response = await fetch("/api/admin/social", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData(initialFormData);
        await fetchProjects();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-white/50 font-mono">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-mono font-bold text-white">Social Projects</h1>
        <div className="flex gap-2">
          <button
            onClick={handleRefreshAll}
            disabled={refreshingAll || projects.length === 0}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 font-mono rounded hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            {refreshingAll ? "Refreshing..." : "Refresh All from TikTok"}
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-price-social text-white font-mono rounded hover:bg-price-social/80 transition-colors"
          >
            Create Project
          </button>
        </div>
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
            {editingId ? "Edit Project" : "Create New Project"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-mono text-white/50 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
                  required
                />
              </div>

              {/* TikTok URL */}
              <div>
                <label className="block text-sm font-mono text-white/50 mb-1">
                  TikTok URL *
                </label>
                <input
                  type="url"
                  value={formData.tiktokUrl}
                  onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                  placeholder="https://tiktok.com/@user/video/..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-mono text-white/50 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
                required
              />
            </div>

            {/* TikTok Embed HTML */}
            <div>
              <label className="block text-sm font-mono text-white/50 mb-1">
                TikTok Embed HTML (optional)
              </label>
              <textarea
                value={formData.tiktokEmbedHtml}
                onChange={(e) => setFormData({ ...formData, tiktokEmbedHtml: e.target.value })}
                rows={2}
                placeholder="<blockquote>...</blockquote>"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono text-sm"
              />
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-white/50 mb-1">
                  Floor Price ($)
                </label>
                <input
                  type="number"
                  value={formData.floorPrice}
                  onChange={(e) => setFormData({ ...formData, floorPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-white/50 mb-1">
                  Cap Price ($)
                </label>
                <input
                  type="number"
                  value={formData.capPrice}
                  onChange={(e) => setFormData({ ...formData, capPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
                />
              </div>
            </div>

            {/* Offer Duration */}
            <div>
              <label className="block text-sm font-mono text-white/50 mb-1">
                Offer Duration (hours from creation)
              </label>
              <input
                type="number"
                value={formData.durationHours}
                onChange={(e) => setFormData({ ...formData, durationHours: Number(e.target.value) })}
                min={1}
                max={720}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
              />
              <p className="text-xs text-white/30 mt-1">
                The countdown expires X hours after creation. Default: 48h, Max: 30 days (720h)
              </p>
            </div>

            {/* Metrics */}
            <div>
              <label className="block text-sm font-mono text-white/50 mb-2">
                TikTok Metrics (auto-fetched from TikTok)
              </label>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs text-white/30 mb-1">Views</label>
                  <input
                    type="number"
                    value={formData.viewsCount}
                    onChange={(e) => setFormData({ ...formData, viewsCount: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/30 mb-1">Likes</label>
                  <input
                    type="number"
                    value={formData.likesCount}
                    onChange={(e) => setFormData({ ...formData, likesCount: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/30 mb-1">Comments</label>
                  <input
                    type="number"
                    value={formData.commentsCount}
                    onChange={(e) => setFormData({ ...formData, commentsCount: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/30 mb-1">Shares</label>
                  <input
                    type="number"
                    value={formData.sharesCount}
                    onChange={(e) => setFormData({ ...formData, sharesCount: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white font-mono text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-white/30 mt-1">
                Formula: (views × $1) + (likes × $10) + (comments × $50) + (shares × $100)
              </p>
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
                className="px-4 py-2 bg-price-social text-white font-mono rounded hover:bg-price-social/80 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <p className="text-white/50 font-mono">No social projects yet. Create one to get started.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono font-bold text-white">{project.title}</p>
                  <p className="text-sm text-white/50 mt-1">{project.description}</p>
                  <a
                    href={project.tiktok_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-price-social hover:underline"
                  >
                    View TikTok
                  </a>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-price-social text-xl">
                    {formatPrice(project.calculated_price)}
                  </p>
                  <span className={`text-xs ${project.is_active ? 'text-green-400' : 'text-white/50'}`}>
                    {project.status} {project.is_active ? '(active)' : '(inactive)'}
                  </span>
                  {project.expires_at && (
                    <p className={`text-xs mt-1 ${new Date(project.expires_at) > new Date() ? 'text-price-social' : 'text-red-400'}`}>
                      {new Date(project.expires_at) > new Date()
                        ? `Expires: ${new Date(project.expires_at).toLocaleString()}`
                        : 'EXPIRED'}
                    </p>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-lg font-mono text-white">{project.views_count.toLocaleString()}</p>
                  <p className="text-xs text-white/40">views</p>
                </div>
                <div>
                  <p className="text-lg font-mono text-white">{project.likes_count.toLocaleString()}</p>
                  <p className="text-xs text-white/40">likes</p>
                </div>
                <div>
                  <p className="text-lg font-mono text-white">{project.comments_count.toLocaleString()}</p>
                  <p className="text-xs text-white/40">comments</p>
                </div>
                <div>
                  <p className="text-lg font-mono text-white">{project.shares_count.toLocaleString()}</p>
                  <p className="text-xs text-white/40">shares</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleRefresh(project.id)}
                  disabled={refreshingId === project.id}
                  className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 font-mono rounded hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                >
                  {refreshingId === project.id ? "Refreshing..." : "🔄 Refresh"}
                </button>
                <button
                  onClick={() => handleEdit(project)}
                  className="px-3 py-1 text-sm bg-white/10 text-white font-mono rounded hover:bg-white/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
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
