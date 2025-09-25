"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    projects: 0,
    technologies: 0,
    integrations: 0
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }

    // Fetch stats
    const fetchStats = async () => {
      try {
        const [projectsRes, technologiesRes, integrationsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/technologies'),
          fetch('/api/integrations')
        ]);

        const [projects, technologies, integrations] = await Promise.all([
          projectsRes.json(),
          technologiesRes.json(),
          integrationsRes.json()
        ]);

        setStats({
          projects: projects.success ? projects.data.length : 0,
          technologies: technologies.success ? technologies.data.length : 0,
          integrations: integrations.success ? integrations.data.length : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-200" style={{fontFamily: 'Share Tech Mono, monospace'}}>
          LOADING...
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b-4 border-amber-600 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-amber-200 tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
                ADMIN CONTROL
              </h1>
              <p className="text-sm text-blue-300 mt-2" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                CONTENT MANAGEMENT SYSTEM ◆ WELCOME {session.user.name?.toUpperCase()}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                className="px-6 py-3 bg-sage hover:bg-sage-light text-white font-bold transition-colors"
                style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
              >
                VIEW SITE
              </Link>
              <button
                onClick={() => signOut()}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
                style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border-2 border-amber-600 p-6" style={{borderRadius: '0 20px 20px 0'}}>
            <h3 className="text-lg font-bold text-amber-200 mb-2" style={{fontFamily: 'Orbitron, sans-serif'}}>
              PROJECTS
            </h3>
            <p className="text-3xl font-bold text-sage-light" style={{fontFamily: 'Share Tech Mono, monospace'}}>
              {stats.projects}
            </p>
          </div>
          <div className="bg-gray-900 border-2 border-amber-600 p-6" style={{borderRadius: '0 20px 20px 0'}}>
            <h3 className="text-lg font-bold text-amber-200 mb-2" style={{fontFamily: 'Orbitron, sans-serif'}}>
              TECHNOLOGIES
            </h3>
            <p className="text-3xl font-bold text-sage-light" style={{fontFamily: 'Share Tech Mono, monospace'}}>
              {stats.technologies}
            </p>
          </div>
          <div className="bg-gray-900 border-2 border-amber-600 p-6" style={{borderRadius: '0 20px 20px 0'}}>
            <h3 className="text-lg font-bold text-amber-200 mb-2" style={{fontFamily: 'Orbitron, sans-serif'}}>
              INTEGRATIONS
            </h3>
            <p className="text-3xl font-bold text-sage-light" style={{fontFamily: 'Share Tech Mono, monospace'}}>
              {stats.integrations}
            </p>
          </div>
        </div>

        {/* Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/projects"
            className="group bg-gray-900 border-2 border-amber-600 p-8 hover:bg-gray-800 transition-colors block"
            style={{borderRadius: '0 20px 20px 0'}}
          >
            <h3 className="text-xl font-bold text-amber-200 mb-4" style={{fontFamily: 'Orbitron, sans-serif'}}>
              MANAGE PROJECTS
            </h3>
            <p className="text-gray-400 mb-4" style={{fontFamily: 'Share Tech Mono, monospace'}}>
              Add, edit, and organize your open source projects
            </p>
            <div className="text-sage-light font-bold group-hover:text-sage" style={{fontFamily: 'Antonio, sans-serif'}}>
              ACCESS MODULE →
            </div>
          </Link>

          <Link
            href="/admin/technologies"
            className="group bg-gray-900 border-2 border-amber-600 p-8 hover:bg-gray-800 transition-colors block"
            style={{borderRadius: '0 20px 20px 0'}}
          >
            <h3 className="text-xl font-bold text-amber-200 mb-4" style={{fontFamily: 'Orbitron, sans-serif'}}>
              MANAGE TECHNOLOGIES
            </h3>
            <p className="text-gray-400 mb-4" style={{fontFamily: 'Share Tech Mono, monospace'}}>
              Configure technology stack and categorization
            </p>
            <div className="text-sage-light font-bold group-hover:text-sage" style={{fontFamily: 'Antonio, sans-serif'}}>
              ACCESS MODULE →
            </div>
          </Link>

          <Link
            href="/admin/integrations"
            className="group bg-gray-900 border-2 border-amber-600 p-8 hover:bg-gray-800 transition-colors block"
            style={{borderRadius: '0 20px 20px 0'}}
          >
            <h3 className="text-xl font-bold text-amber-200 mb-4" style={{fontFamily: 'Orbitron, sans-serif'}}>
              MANAGE INTEGRATIONS
            </h3>
            <p className="text-gray-400 mb-4" style={{fontFamily: 'Share Tech Mono, monospace'}}>
              Control system integrations and services
            </p>
            <div className="text-sage-light font-bold group-hover:text-sage" style={{fontFamily: 'Antonio, sans-serif'}}>
              ACCESS MODULE →
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}