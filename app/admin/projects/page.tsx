"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  live_url: string;
  source_url: string;
  image_url?: string;
  status: "active" | "maintenance" | "archived";
  featured: boolean;
  sort_order: number;
  architecture_diagram?: string;
  architecture_code?: string;
  tech_stack_description?: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectsAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/admin/login");
      return;
    }
    fetchProjects();
  }, [session, status, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-amber-200" style={{fontFamily: 'Share Tech Mono, monospace'}}>
          LOADING ADMIN PANEL...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-amber-200" style={{fontFamily: 'Orbitron, sans-serif'}}>
            PROJECT MANAGEMENT
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleNew}
              className="px-6 py-3 bg-sage hover:bg-sage-light text-white font-bold transition-colors"
              style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
            >
              NEW PROJECT
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors"
              style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
            >
              BACK TO ADMIN
            </button>
          </div>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-transparent mb-8" />

        {showForm && <ProjectForm
          project={editingProject}
          onSave={() => {
            setShowForm(false);
            fetchProjects();
          }}
          onCancel={() => setShowForm(false)}
        />}

        <div className="grid gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-900 border-2 border-amber-600 p-6"
              style={{borderRadius: '0 20px 20px 0'}}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-amber-200" style={{fontFamily: 'Orbitron, sans-serif'}}>
                    {project.name}
                  </h2>
                  <p className="text-gray-400 text-sm" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                    {project.slug} • {project.status} • Order: {project.sort_order}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors text-sm"
                    style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold transition-colors text-sm"
                    style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
                  >
                    DELETE
                  </button>
                </div>
              </div>
              <p className="text-gray-300 mb-4" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                {project.description}
              </p>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>Featured: {project.featured ? 'Yes' : 'No'}</span>
                <span>•</span>
                <span>Architecture: {project.architecture_diagram ? 'Yes' : 'No'}</span>
                <span>•</span>
                <span>Tech Stack: {project.tech_stack_description ? 'Yes' : 'No'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  onSave,
  onCancel
}: {
  project: Project | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    slug: project?.slug || '',
    description: project?.description || '',
    long_description: project?.long_description || '',
    live_url: project?.live_url || '',
    source_url: project?.source_url || '',
    image_url: project?.image_url || '',
    status: project?.status || 'active',
    featured: project?.featured || false,
    sort_order: project?.sort_order || 0,
    architecture_diagram: project?.architecture_diagram || '',
    architecture_code: project?.architecture_code || '',
    tech_stack_description: project?.tech_stack_description || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = project ? `/api/projects/${project.id}` : '/api/projects';
      const method = project ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className="bg-gray-900 border-2 border-sage p-8 mb-8" style={{borderRadius: '0 20px 20px 0'}}>
      <h2 className="text-xl font-bold text-amber-200 mb-6" style={{fontFamily: 'Orbitron, sans-serif'}}>
        {project ? 'EDIT PROJECT' : 'NEW PROJECT'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
              PROJECT NAME
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  name,
                  slug: prev.slug || generateSlug(name)
                }));
              }}
              className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
              SLUG
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
              LIVE URL
            </label>
            <input
              type="url"
              value={formData.live_url}
              onChange={(e) => setFormData(prev => ({ ...prev, live_url: e.target.value }))}
              className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
              SOURCE URL
            </label>
            <input
              type="url"
              value={formData.source_url}
              onChange={(e) => setFormData(prev => ({ ...prev, source_url: e.target.value }))}
              className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
              STATUS
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "active" | "maintenance" | "archived" }))}
              className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
              SORT ORDER
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
            DESCRIPTION
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none resize-none"
            style={{fontFamily: 'Share Tech Mono, monospace'}}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
            TECH STACK DESCRIPTION
          </label>
          <textarea
            value={formData.tech_stack_description}
            onChange={(e) => setFormData(prev => ({ ...prev, tech_stack_description: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none resize-none"
            style={{fontFamily: 'Share Tech Mono, monospace'}}
            placeholder="Brief description of the technologies used..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
            ARCHITECTURE DIAGRAM (Mermaid Code)
          </label>
          <textarea
            value={formData.architecture_diagram}
            onChange={(e) => setFormData(prev => ({ ...prev, architecture_diagram: e.target.value }))}
            rows={8}
            className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none resize-none"
            style={{fontFamily: 'Share Tech Mono, monospace'}}
            placeholder="graph TB&#10;A[Component A] --> B[Component B]&#10;B --> C[Component C]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
            ARCHITECTURE CODE
          </label>
          <textarea
            value={formData.architecture_code}
            onChange={(e) => setFormData(prev => ({ ...prev, architecture_code: e.target.value }))}
            rows={8}
            className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none resize-none"
            style={{fontFamily: 'Share Tech Mono, monospace'}}
            placeholder="// Architecture code snippet&#10;const architecture = {&#10;  frontend: 'Next.js',&#10;  backend: 'API Routes'&#10;};"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
            className="mr-2"
          />
          <label htmlFor="featured" className="text-sm font-bold text-gray-300" style={{fontFamily: 'Antonio, sans-serif'}}>
            FEATURED PROJECT
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-sage hover:bg-sage-light disabled:bg-gray-600 text-white font-bold transition-colors"
            style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
          >
            {saving ? 'SAVING...' : 'SAVE PROJECT'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors"
            style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}