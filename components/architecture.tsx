"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import mermaid from "mermaid";

interface Project {
  id: number;
  name: string;
  architecture_diagram?: string;
  architecture_code?: string;
  tech_stack_description?: string;
}

export default function Architecture() {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  const { theme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [diagramLoading, setDiagramLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          setProjects(result.data);
          setSelectedProject(result.data[0]);
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
    const renderMermaid = async () => {
      if (!mermaidRef.current || !selectedProject?.architecture_diagram || showCode) return;

      setDiagramLoading(true);

      try {
        // Initialize mermaid with simplified config for better performance
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? "dark" : "base",
          themeVariables: {
            primaryColor: "#87A96B",
            primaryBorderColor: "#2563EB",
            primaryTextColor: theme === 'dark' ? "#fff" : "#000",
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: false // Disable HTML labels for better performance
          }
        });

        // Clear previous content
        mermaidRef.current.innerHTML = '';

        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, selectedProject.architecture_diagram);
        mermaidRef.current.innerHTML = svg;
      } catch (error) {
        console.error('Error rendering mermaid diagram:', error);
        mermaidRef.current.innerHTML = `<div class="text-red-500 p-4 text-center">Failed to render diagram</div>`;
      } finally {
        setDiagramLoading(false);
      }
    };

    // Debounce rendering to avoid multiple rapid renders
    const timeoutId = setTimeout(renderMermaid, 100);
    return () => clearTimeout(timeoutId);
  }, [theme, selectedProject, showCode]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-terracotta dark:text-amber-200" style={{fontFamily: 'Share Tech Mono, monospace'}}>
          LOADING ARCHITECTURE...
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400" style={{fontFamily: 'Share Tech Mono, monospace'}}>
          NO ARCHITECTURE DATA AVAILABLE
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.length > 1 && (
        <div className="bg-white dark:bg-gray-900 border-2 border-sage dark:border-amber-600 p-6" style={{borderRadius: '0 20px 20px 0'}}>
          <h3 className="text-lg font-bold text-terracotta dark:text-amber-200 mb-4" style={{fontFamily: 'Orbitron, sans-serif'}}>
            SELECT PROJECT
          </h3>
          <div className="flex flex-wrap gap-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`px-4 py-2 font-bold transition-colors ${
                  selectedProject.id === project.id
                    ? 'bg-amber-600 text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border-2 border-sage dark:border-amber-600 p-8" style={{borderRadius: '0 20px 20px 0'}}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-terracotta dark:text-amber-200" style={{fontFamily: 'Orbitron, sans-serif'}}>
            {selectedProject.name.toUpperCase()} ARCHITECTURE
          </h2>
          {selectedProject.architecture_diagram && (
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-4 py-2 bg-sage hover:bg-sage-light text-white font-bold transition-colors"
              style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
            >
              {showCode ? 'SHOW DIAGRAM' : 'SHOW CODE'}
            </button>
          )}
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-sage dark:from-amber-600 via-sage-light dark:via-yellow-500 to-transparent mb-6" />

        {!showCode ? (
          <div className="bg-white/80 dark:bg-black/80 rounded-lg p-8">
            {selectedProject.architecture_diagram ? (
              <>
                {diagramLoading && (
                  <div className="text-center py-8">
                    <div className="text-sage dark:text-amber-200 animate-pulse" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                      RENDERING DIAGRAM...
                    </div>
                  </div>
                )}
                <div ref={mermaidRef} className="text-center" style={{ display: diagramLoading ? 'none' : 'block' }}>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 py-12" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                NO ARCHITECTURE DIAGRAM AVAILABLE
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-black/80 rounded-lg p-8">
            <pre
              ref={codeRef}
              className="text-sage-dark dark:text-sage-light text-sm overflow-x-auto"
              style={{fontFamily: 'Share Tech Mono, monospace'}}
            >
              {selectedProject.architecture_diagram || 'NO MERMAID CODE AVAILABLE'}
            </pre>
          </div>
        )}

        {selectedProject.tech_stack_description && (
          <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg border border-sage/20 dark:border-amber-600/20">
            <h3 className="text-lg font-bold text-terracotta dark:text-amber-200 mb-3" style={{fontFamily: 'Orbitron, sans-serif'}}>
              TECHNICAL OVERVIEW
            </h3>
            <p className="text-gray-700 dark:text-gray-300" style={{fontFamily: 'Share Tech Mono, monospace'}}>
              {selectedProject.tech_stack_description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}