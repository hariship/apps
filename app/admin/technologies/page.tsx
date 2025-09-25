"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Technology {
  id: number;
  name: string;
  slug: string;
  category: string;
  color: string;
  icon?: string;
  website_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  'frontend',
  'backend',
  'database',
  'devops',
  'tool',
  'framework',
  'language'
];

export default function TechnologiesAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/admin/login");
      return;
    }
    fetchTechnologies();
  }, [session, status, router]);

  const fetchTechnologies = async () => {
    try {
      const response = await fetch('/api/technologies');
      const result = await response.json();
      if (result.success) {
        setTechnologies(result.data);
      }
    } catch (error) {
      console.error('Error fetching technologies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (technology: Technology) => {
    setEditingTechnology(technology);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingTechnology(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this technology?')) return;

    try {
      const response = await fetch(`/api/technologies/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTechnologies(technologies.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting technology:', error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-amber-200" style={{fontFamily: 'Share Tech Mono, monospace'}}>
          LOADING TECHNOLOGIES...
        </div>
      </div>
    );
  }

  const groupedTechnologies = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-amber-200" style={{fontFamily: 'Orbitron, sans-serif'}}>
            TECHNOLOGY MANAGEMENT
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleNew}
              className="px-6 py-3 bg-sage hover:bg-sage-light text-white font-bold transition-colors"
              style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
            >
              NEW TECHNOLOGY
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

        {showForm && <TechnologyForm
          technology={editingTechnology}
          onSave={() => {
            setShowForm(false);
            fetchTechnologies();
          }}
          onCancel={() => setShowForm(false)}
        />}

        <div className="space-y-8">
          {CATEGORIES.map(category => {
            const categoryTechs = groupedTechnologies[category] || [];
            if (categoryTechs.length === 0) return null;

            return (
              <div key={category} className="bg-gray-900 border-2 border-amber-600 p-6" style={{borderRadius: '0 20px 20px 0'}}>
                <h2 className="text-xl font-bold text-amber-200 mb-4 uppercase" style={{fontFamily: 'Orbitron, sans-serif'}}>
                  {category} ({categoryTechs.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTechs.map((tech) => (
                    <div
                      key={tech.id}
                      className="bg-gray-800 border border-gray-600 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: tech.color }}
                          />
                          <h3 className="text-lg font-bold text-amber-200" style={{fontFamily: 'Orbitron, sans-serif'}}>
                            {tech.name}
                          </h3>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(tech)}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors rounded"
                            style={{fontFamily: 'Antonio, sans-serif'}}
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleDelete(tech.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors rounded"
                            style={{fontFamily: 'Antonio, sans-serif'}}
                          >
                            DEL
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                        {tech.slug} • {tech.active ? 'Active' : 'Inactive'}
                      </p>
                      {tech.website_url && (
                        <a
                          href={tech.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sage-light hover:text-sage text-sm"
                          style={{fontFamily: 'Share Tech Mono, monospace'}}
                        >
                          Visit Website ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TechnologyForm({
  technology,
  onSave,
  onCancel
}: {
  technology: Technology | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: technology?.name || '',
    slug: technology?.slug || '',
    category: technology?.category || 'tool',
    color: technology?.color || '#6B7280',
    icon: technology?.icon || '',
    website_url: technology?.website_url || '',
    active: technology?.active ?? true
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = technology ? `/api/technologies/${technology.id}` : '/api/technologies';
      const method = technology ? 'PUT' : 'POST';

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
      console.error('Error saving technology:', error);
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
        {technology ? 'EDIT TECHNOLOGY' : 'NEW TECHNOLOGY'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
              TECHNOLOGY NAME
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
              CATEGORY
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
              COLOR
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-12 h-10 border-2 border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="flex-1 px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none"
                style={{fontFamily: 'Share Tech Mono, monospace'}}
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
              ICON NAME (Optional)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
              placeholder="e.g. nextjs, react, typescript"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
              WEBSITE URL (Optional)
            </label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
              className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
            className="mr-2"
          />
          <label htmlFor="active" className="text-sm font-bold text-gray-300" style={{fontFamily: 'Antonio, sans-serif'}}>
            ACTIVE TECHNOLOGY
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-sage hover:bg-sage-light disabled:bg-gray-600 text-white font-bold transition-colors"
            style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
          >
            {saving ? 'SAVING...' : 'SAVE TECHNOLOGY'}
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