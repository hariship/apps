"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import mermaid from 'mermaid';

interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  live_url?: string;
  source_url?: string;
  status: string;
  architecture_diagram?: string;
  tech_stack_description?: string;
  technologies: Technology[];
}

interface Technology {
  id: number;
  name: string;
  slug: string;
  category: string;
  color: string;
  website_url?: string;
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

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [project, setProject] = useState<Project | null>(null);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchitectureCode, setShowArchitectureCode] = useState(false);
  const [showDiagramModal, setShowDiagramModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectsResponse = await fetch('/api/projects');
        const projectsResult = await projectsResponse.json();

        if (projectsResult.success) {
          const foundProject = projectsResult.data.find((p: Project) => p.slug === params.slug);
          if (foundProject) {
            // Fetch detailed project info
            const detailResponse = await fetch(`/api/projects/${foundProject.id}`);
            const detailResult = await detailResponse.json();
            if (detailResult.success) {
              setProject(detailResult.data);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProject();
    }
  }, [params.slug]);

  useEffect(() => {
    const fetchCommits = async () => {
      if (!project?.source_url) return;

      try {
        const match = project.source_url.match(/github\.com\/([^\/]+\/[^\/]+)/);
        if (match) {
          const repo = match[1].replace('.git', '');
          const response = await fetch(`/api/github-commits?repo=${repo}&limit=10`);
          const result = await response.json();
          if (result.success) {
            setCommits(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching commits:', error);
      }
    };

    if (project) {
      fetchCommits();
    }
  }, [project]);

  useEffect(() => {
    if (project?.architecture_diagram && theme) {
      const renderDiagram = async () => {
        try {
          mermaid.initialize({
            startOnLoad: false,
            theme: theme === 'dark' ? "dark" : "base",
            themeVariables: theme === 'dark' ? {
              // Dark mode - high contrast for readability
              primaryColor: "#374151",
              primaryBorderColor: "#6b8caf",
              primaryTextColor: "#ffffff",
              secondaryColor: "#4b5563",
              tertiaryColor: "#6b7280",
              background: "#111827",
              mainBkg: "#374151",
              secondBkg: "#4b5563",
              lineColor: "#6b8caf",
              edgeLabelBackground: "#1f2937",
              clusterBkg: "#1f2937",
              clusterBorder: "#6b8caf",
              defaultLinkColor: "#6b8caf",
            } : {
              // Light mode
              primaryColor: "#ffffff",
              primaryBorderColor: "#6b8caf",
              primaryTextColor: "#000000",
              secondaryColor: "#f8fafc",
              tertiaryColor: "#e2e8f0",
              background: "#ffffff",
              mainBkg: "#ffffff",
              secondBkg: "#f8fafc",
              lineColor: "#6b8caf",
              edgeLabelBackground: "#ffffff",
              clusterBkg: "#f8fafc",
              clusterBorder: "#6b8caf",
              defaultLinkColor: "#6b8caf",
            },
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
            }
          });

          const mermaidElement = document.getElementById('mermaid-diagram');
          if (mermaidElement && project.architecture_diagram) {
            const { svg } = await mermaid.render(`mermaid-${Date.now()}`, project.architecture_diagram);
            mermaidElement.innerHTML = svg;
          }
        } catch (error) {
          console.error('Error rendering Mermaid diagram:', error);
        }
      };

      const timer = setTimeout(renderDiagram, 100);
      return () => clearTimeout(timer);
    }
  }, [project?.architecture_diagram, theme]);

  useEffect(() => {
    if (project?.architecture_diagram && theme && showDiagramModal) {
      const renderModalDiagram = async () => {
        try {
          mermaid.initialize({
            startOnLoad: false,
            theme: theme === 'dark' ? "dark" : "base",
            themeVariables: theme === 'dark' ? {
              primaryColor: "#374151",
              primaryBorderColor: "#6b8caf",
              primaryTextColor: "#ffffff",
              secondaryColor: "#4b5563",
              tertiaryColor: "#6b7280",
              background: "#111827",
              mainBkg: "#374151",
              secondBkg: "#4b5563",
              lineColor: "#6b8caf",
              edgeLabelBackground: "#1f2937",
              clusterBkg: "#1f2937",
              clusterBorder: "#6b8caf",
              defaultLinkColor: "#6b8caf",
            } : {
              primaryColor: "#ffffff",
              primaryBorderColor: "#6b8caf",
              primaryTextColor: "#000000",
              secondaryColor: "#f8fafc",
              tertiaryColor: "#e2e8f0",
              background: "#ffffff",
              mainBkg: "#ffffff",
              secondBkg: "#f8fafc",
              lineColor: "#6b8caf",
              edgeLabelBackground: "#ffffff",
              clusterBkg: "#f8fafc",
              clusterBorder: "#6b8caf",
              defaultLinkColor: "#6b8caf",
            },
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
            }
          });

          const modalElement = document.getElementById('mermaid-diagram-modal');
          if (modalElement && project.architecture_diagram) {
            const { svg } = await mermaid.render(`mermaid-modal-${Date.now()}`, project.architecture_diagram);
            modalElement.innerHTML = svg;
          }
        } catch (error) {
          console.error('Error rendering modal Mermaid diagram:', error);
        }
      };

      const timer = setTimeout(renderModalDiagram, 200);
      return () => clearTimeout(timer);
    }
  }, [project?.architecture_diagram, theme, showDiagramModal]);

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
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const techByCategory = project?.technologies?.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>) || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-terracotta dark:text-terracotta animate-pulse" style={{fontFamily: 'Share Tech Mono, monospace'}}>
            LOADING PROJECT...
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-terracotta dark:text-terracotta mb-4" style={{fontFamily: 'Orbitron, sans-serif'}}>
            PROJECT NOT FOUND
          </h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-sage dark:bg-terracotta text-white dark:text-black font-bold"
            style={{fontFamily: 'Antonio, sans-serif'}}
          >
            RETURN TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-x-hidden">
      {/* Header */}
      <header className="border-b-2 border-gray-300 dark:border-terracotta bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 dark:text-terracotta hover:text-gray-700 dark:hover:text-blue-200"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
            >
              ← BACK TO DASHBOARD
            </button>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="px-4 py-2 bg-gray-400 dark:bg-terracotta hover:bg-gray-500 dark:hover:bg-terracotta-light text-white dark:text-black text-sm font-bold transition-colors"
                style={{fontFamily: 'Antonio, sans-serif', borderRadius: '15px 3px 3px 15px'}}
              >
                {mounted ? (theme === "dark" ? "LIGHT" : "DARK") : "THEME"}
              </button>
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-500 dark:bg-terracotta hover:bg-gray-600 dark:hover:bg-terracotta-light text-white dark:text-black text-sm font-bold transition-colors text-center"
                  style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
                >
                  VIEW LIVE ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-terracotta dark:text-terracotta mb-2" style={{fontFamily: 'Orbitron, sans-serif'}}>
            {project.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
          <div className="h-1 w-full bg-gradient-to-r from-gray-400 dark:from-terracotta to-transparent mb-6" />
          <p className="text-gray-700 dark:text-gray-400">{project.long_description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 overflow-x-hidden">
          {/* Architecture & Tech Stack */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-8 min-w-0">
            {/* Architecture */}
            {project.architecture_diagram && (
              <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-terracotta p-6" style={{borderRadius: '0 20px 20px 0'}}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-terracotta dark:text-terracotta" style={{fontFamily: 'Orbitron, sans-serif'}}>
                    SYSTEM ARCHITECTURE
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <button
                      onClick={() => setShowDiagramModal(true)}
                      className="px-2 sm:px-3 py-1 bg-terracotta dark:bg-terracotta hover:bg-terracotta-light dark:hover:bg-terracotta-light text-white dark:text-black text-xs font-bold uppercase transition-colors rounded"
                      style={{fontFamily: 'Share Tech Mono, monospace'}}
                    >
                      EXPAND
                    </button>
                    <button
                      onClick={() => setShowArchitectureCode(!showArchitectureCode)}
                      className="px-2 sm:px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase transition-colors rounded"
                      style={{fontFamily: 'Share Tech Mono, monospace'}}
                    >
                      {showArchitectureCode ? 'HIDE' : 'CODE'}
                    </button>
                  </div>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-gray-400 dark:from-terracotta to-transparent mb-6" />

                {showArchitectureCode ? (
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border">
                    <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                      {project.architecture_diagram}
                    </pre>
                  </div>
                ) : (
                  <div
                    id="mermaid-diagram"
                    className="mermaid-container bg-white dark:bg-gray-800 p-4 rounded border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors overflow-hidden"
                    onClick={() => setShowDiagramModal(true)}
                    title="Click to expand diagram"
                    style={{maxWidth: '100%', maxHeight: '300px'}}
                  ></div>
                )}
              </div>
            )}

            {/* Tech Stack */}
            {Object.keys(techByCategory).length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-terracotta p-6" style={{borderRadius: '0 20px 20px 0'}}>
                <h2 className="text-2xl font-bold text-terracotta dark:text-terracotta mb-4" style={{fontFamily: 'Orbitron, sans-serif'}}>
                  TECHNOLOGY STACK
                </h2>
                <div className="h-1 w-full bg-gradient-to-r from-gray-400 dark:from-terracotta to-transparent mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(techByCategory).map(([category, techs]) => (
                    <div key={category} className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                      <h3 className="text-lg font-bold text-terracotta dark:text-terracotta mb-3 uppercase" style={{fontFamily: 'Orbitron, sans-serif'}}>
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {techs.map((tech) => (
                          <div key={tech.id} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: tech.color}} />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{tech.name}</span>
                            {tech.website_url && (
                              <a
                                href={tech.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto text-xs text-gray-600 dark:text-terracotta hover:text-gray-700 dark:hover:text-blue-200"
                                style={{fontFamily: 'Share Tech Mono, monospace'}}
                              >
                                DOCS ↗
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Commits */}
          <div className="space-y-4 sm:space-y-6 min-w-0">
            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-terracotta p-6" style={{borderRadius: '0 20px 20px 0'}}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-terracotta dark:text-terracotta" style={{fontFamily: 'Orbitron, sans-serif'}}>
                  RECENT COMMITS
                </h2>
                {project.source_url && (
                  <a
                    href={project.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-600 dark:text-terracotta hover:text-gray-700 dark:hover:text-blue-200"
                    style={{fontFamily: 'Share Tech Mono, monospace'}}
                  >
                    VIEW REPO ↗
                  </a>
                )}
              </div>
              <div className="h-0.5 w-full bg-gradient-to-r from-gray-400 dark:from-terracotta to-transparent mb-4" />

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {commits.map((commit) => (
                  <div key={commit.id} className="border-l-2 border-sage/30 dark:border-terracotta/30 pl-3">
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white hover:text-terracotta dark:hover:text-blue-200">
                        {commit.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-mono text-gray-600 dark:text-terracotta">{commit.sha}</span>
                        <span>by {commit.author}</span>
                        <span>{formatDate(commit.date)}</span>
                      </div>
                    </a>
                  </div>
                ))}
                {commits.length === 0 && (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    No recent commits found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Diagram Modal */}
      {showDiagramModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-start sm:items-center justify-center z-50 p-1 sm:p-4 overflow-y-auto" onClick={() => setShowDiagramModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-2 sm:p-6 w-full max-w-[98vw] sm:max-w-4xl min-h-[50vh] max-h-none sm:max-h-[90vh] my-2 sm:my-0" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-terracotta dark:text-terracotta" style={{fontFamily: 'Orbitron, sans-serif'}}>
                ARCHITECTURE
              </h3>
              <button
                onClick={() => setShowDiagramModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl sm:text-2xl font-bold p-1"
              >
                ×
              </button>
            </div>
            <div
              id="mermaid-diagram-modal"
              className="mermaid-container bg-white dark:bg-gray-800 p-1 sm:p-4 rounded border w-full overflow-auto"
              style={{minHeight: '250px', maxHeight: 'none', maxWidth: '100%'}}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}