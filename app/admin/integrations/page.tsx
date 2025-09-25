"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Integration {
  id: number;
  name: string;
  slug: string;
  description: string;
  url: string;
  icon?: string;
  status: 'operational' | 'maintenance' | 'outage';
  version?: string;
  created_at: string;
  updated_at: string;
}

const STATUSES = [
  { value: 'operational', label: 'Operational', color: 'text-green-400' },
  { value: 'maintenance', label: 'Maintenance', color: 'text-yellow-400' },
  { value: 'outage', label: 'Outage', color: 'text-red-400' }
];

export default function IntegrationsAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/admin/login");
      return;
    }
    fetchIntegrations();
  }, [session, status, router]);

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations');
      const result = await response.json();
      if (result.success) {
        setIntegrations(result.data);
      }
    } catch (error) {
      console.error('Error fetching integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (integration: Integration) => {
    setEditingIntegration(integration);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingIntegration(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this integration?')) return;

    try {
      const response = await fetch(`/api/integrations/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setIntegrations(integrations.filter(i => i.id !== id));
      }
    } catch (error) {
      console.error('Error deleting integration:', error);
    }
  };

  const getStatusInfo = (status: string) => {
    return STATUSES.find(s => s.value === status) || STATUSES[0];
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-amber-200" style={{fontFamily: 'Share Tech Mono, monospace'}}>
          LOADING INTEGRATIONS...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-amber-200" style={{fontFamily: 'Orbitron, sans-serif'}}>
            INTEGRATION MANAGEMENT
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleNew}
              className="px-6 py-3 bg-sage hover:bg-sage-light text-white font-bold transition-colors"
              style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
            >
              NEW INTEGRATION
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

        {showForm && <IntegrationForm
          integration={editingIntegration}
          onSave={() => {
            setShowForm(false);
            fetchIntegrations();
          }}
          onCancel={() => setShowForm(false)}
        />}

        <div className="space-y-6">
          {integrations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                NO INTEGRATIONS CONFIGURED
              </div>
            </div>
          ) : (
            integrations.map((integration) => (
              <div
                key={integration.id}
                className="bg-gray-900 border-2 border-amber-600 p-6"
                style={{borderRadius: '0 20px 20px 0'}}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-amber-200" style={{fontFamily: 'Orbitron, sans-serif'}}>
                        {integration.name}
                      </h2>
                      <p className="text-gray-400 text-sm" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                        {integration.slug} • {integration.version || 'No version'}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusInfo(integration.status).color} bg-gray-800`}>
                      ● {getStatusInfo(integration.status).label.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(integration)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors text-sm"
                      style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(integration.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold transition-colors text-sm"
                      style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 mb-4" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                  {integration.description}
                </p>
                <div className="flex gap-4 text-sm">
                  <a
                    href={integration.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sage-light hover:text-sage"
                    style={{fontFamily: 'Share Tech Mono, monospace'}}
                  >
                    Visit Service ↗
                  </a>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                    Added: {new Date(integration.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function IntegrationForm({
  integration,
  onSave,
  onCancel
}: {
  integration: Integration | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: integration?.name || '',
    slug: integration?.slug || '',
    description: integration?.description || '',
    url: integration?.url || '',
    icon: integration?.icon || '',
    status: integration?.status || 'operational',
    version: integration?.version || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = integration ? `/api/integrations/${integration.id}` : '/api/integrations';
      const method = integration ? 'PUT' : 'POST';

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
      console.error('Error saving integration:', error);
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
        {integration ? 'EDIT INTEGRATION' : 'NEW INTEGRATION'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
              INTEGRATION NAME
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
              URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "operational" | "maintenance" | "outage" }))}
              className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
            >
              {STATUSES.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
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
              placeholder="e.g. vercel, cloudflare, github"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" style={{fontFamily: 'Antonio, sans-serif'}}>
              VERSION (Optional)
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
              className="w-full px-4 py-2 bg-black border-2 border-gray-600 text-white focus:border-amber-600 outline-none"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
              placeholder="e.g. v1.0.0, 2.1.3"
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
            placeholder="Brief description of the integration..."
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-sage hover:bg-sage-light disabled:bg-gray-600 text-white font-bold transition-colors"
            style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
          >
            {saving ? 'SAVING...' : 'SAVE INTEGRATION'}
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