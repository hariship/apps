"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ProjectGrid from "@/components/project-grid";

interface Technology {
  id: number;
  name: string;
  slug: string;
  category: string;
  color: string;
  icon?: string;
  website_url?: string;
}

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
  technologies: Technology[];
  created_at: string;
  updated_at: string;
}

interface GitHubCommit {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  url: string;
  sha: string;
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentCommits, setRecentCommits] = useState<GitHubCommit[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchRecentCommits = async () => {
      try {
        // Find the Apps Dashboard project and get its GitHub repo
        const appsProject = projects.find(p => p.slug === 'apps-dashboard');
        if (appsProject?.source_url) {
          const match = appsProject.source_url.match(/github\.com\/([^\/]+\/[^\/]+)/);
          if (match) {
            const repo = match[1].replace('.git', '');
            const response = await fetch(`/api/github-commits?repo=${repo}&limit=5`);
            const result = await response.json();
            if (result.success) {
              setRecentCommits(result.data);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching recent commits:', error);
      }
    };

    if (projects.length > 0) {
      fetchRecentCommits();
    }
  }, [projects]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);

    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <header className="border-b-2 border-gray-300 dark:border-terracotta bg-white dark:bg-black transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-terracotta dark:text-terracotta tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
                HARIPRIYA
              </h1>
              <p className="text-xs text-gray-600 dark:text-terracotta mt-1" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                APPS DASHBOARD
              </p>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-4 py-2 bg-gray-400 dark:bg-terracotta hover:bg-gray-500 dark:hover:bg-terracotta-light text-white dark:text-black text-sm font-bold transition-colors"
              style={{fontFamily: 'Antonio, sans-serif', borderRadius: '15px 3px 3px 15px'}}
            >
              {mounted ? (theme === "dark" ? "LIGHT" : "DARK") : "THEME"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-terracotta dark:text-terracotta tracking-wider mb-2" style={{fontFamily: 'Orbitron, sans-serif'}}>
                OPERATIONAL PROJECTS
              </h2>
              <div className="h-1 w-full bg-gradient-to-r from-gray-400 dark:from-terracotta to-transparent mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-sm" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                Click on any project to view architecture, tech stack, and recent commits
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="text-terracotta dark:text-terracotta text-sm animate-pulse" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                  LOADING PROJECTS...
                </div>
              </div>
            ) : (
              <ProjectGrid projects={projects} />
            )}

            {projects.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-sm" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                  NO PROJECTS FOUND
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Commits */}
            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-terracotta p-4" style={{borderRadius: '0 15px 15px 0'}}>
              <h3 className="text-lg font-bold text-terracotta dark:text-terracotta mb-3" style={{fontFamily: 'Orbitron, sans-serif'}}>
                RECENT COMMITS
              </h3>
              <div className="h-0.5 w-full bg-gradient-to-r from-gray-400 dark:from-terracotta to-transparent mb-4" />

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentCommits.map((commit) => (
                  <div key={commit.id} className="border-l-2 border-gray-300 dark:border-terracotta/50 pl-3">
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors"
                    >
                      <div className="text-xs font-medium text-gray-900 dark:text-white hover:text-terracotta dark:hover:text-terracotta truncate">
                        {commit.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-mono text-gray-500 dark:text-terracotta">{commit.sha.substring(0, 7)}</span>
                        <span>{formatDate(commit.date)}</span>
                      </div>
                    </a>
                  </div>
                ))}
                {recentCommits.length === 0 && (
                  <div className="text-center py-4 text-gray-400 text-xs">
                    No recent commits
                  </div>
                )}
              </div>
            </div>

            {/* Contributors */}
            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-terracotta p-4" style={{borderRadius: '0 15px 15px 0'}}>
              <h3 className="text-lg font-bold text-terracotta dark:text-terracotta mb-3" style={{fontFamily: 'Orbitron, sans-serif'}}>
                CONTRIBUTORS
              </h3>
              <div className="h-0.5 w-full bg-gradient-to-r from-gray-400 dark:from-terracotta to-transparent mb-4" />

              <div className="flex flex-col space-y-2">
                {recentCommits.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                        {recentCommits[0]?.author?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {recentCommits[0]?.author || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Lead Developer</div>
                    </div>
                  </div>
                )}
                {recentCommits.length === 0 && (
                  <div className="text-center py-2 text-gray-400 text-xs">
                    Loading contributors...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}