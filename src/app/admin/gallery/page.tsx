"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils/format";

interface GalleryProject {
  id: string;
  title: string;
  description: string | null;
  pricePaid: number;
  projectUrl: string | null;
  screenshotUrl: string | null;
  displayOrder: number;
  isVisible: boolean;
}

interface FormData {
  title: string;
  description: string;
  pricePaid: number;
  projectUrl: string;
  screenshotUrl: string;
  displayOrder: number;
  isVisible: boolean;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  pricePaid: 0,
  projectUrl: "",
  screenshotUrl: "",
  displayOrder: 0,
  isVisible: true,
};

export default function GalleryAdminPage() {
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/gallery");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
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

  const handleEdit = (project: GalleryProject) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description || "",
      pricePaid: project.pricePaid,
      projectUrl: project.projectUrl || "",
      screenshotUrl: project.screenshotUrl || "",
      displayOrder: project.displayOrder,
      isVisible: project.isVisible,
    });
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/admin/gallery?id=${id}`, {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId
        ? { id: editingId, ...formData }
        : formData;

      const response = await fetch("/api/admin/gallery", {
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

  const toggleVisibility = async (project: GalleryProject) => {
    try {
      const response = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: project.id, isVisible: !project.isVisible }),
      });

      if (response.ok) {
        await fetchProjects();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update visibility");
      }
    } catch {
      setError("Failed to update visibility");
    }
  };

  if (isLoading) {
    return <div className="text-white/50 font-mono">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-mono font-bold text-white">Gallery</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-white text-black font-mono rounded hover:bg-white/90 transition-colors"
        >
          Add Project
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
            {editingId ? "Edit Project" : "Add New Project"}
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

              {/* Price Paid */}
              <div>
                <label className="block text-sm font-mono text-white/50 mb-1">
                  Price Paid ($)
                </label>
                <input
                  type="number"
                  value={formData.pricePaid}
                  onChange={(e) => setFormData({ ...formData, pricePaid: Number(e.target.value) })}
                  min={0}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
                />
              </div>

              {/* Project URL */}
              <div>
                <label className="block text-sm font-mono text-white/50 mb-1">
                  Project URL
                </label>
                <input
                  type="url"
                  value={formData.projectUrl}
                  onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
                />
              </div>

              {/* Screenshot URL */}
              <div>
                <label className="block text-sm font-mono text-white/50 mb-1">
                  Screenshot URL
                </label>
                <input
                  type="url"
                  value={formData.screenshotUrl}
                  onChange={(e) => setFormData({ ...formData, screenshotUrl: e.target.value })}
                  placeholder="https://example.com/screenshot.png"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-mono text-white/50 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
                />
              </div>

              {/* Visibility */}
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isVisible" className="text-sm font-mono text-white/70">
                  Visible on public gallery
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-mono text-white/50 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white font-mono"
              />
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
                className="px-4 py-2 bg-white text-black font-mono rounded hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : editingId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <p className="text-white/50 font-mono">No gallery projects. Add one to get started.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-mono font-bold text-white">{project.title}</p>
                  {project.description && (
                    <p className="text-sm text-white/50 mt-1">{project.description}</p>
                  )}
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 mt-1 block"
                    >
                      {project.projectUrl}
                    </a>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-price-low text-xl">
                    {formatPrice(project.pricePaid)}
                  </p>
                  <button
                    onClick={() => toggleVisibility(project)}
                    className={`text-xs mt-1 px-2 py-1 rounded ${
                      project.isVisible
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        : "bg-white/10 text-white/30 hover:bg-white/20"
                    } transition-colors`}
                  >
                    {project.isVisible ? "visible" : "hidden"}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
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
