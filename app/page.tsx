"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Navigation from "@/components/navigation";
import ProjectGrid from "@/components/project-grid";
import SystemStatus from "@/components/system-status";
import Architecture from "@/components/architecture";
import TechStack from "@/components/tech-stack";
import Updates from "@/components/updates";
import { projectsData } from "@/data/projects";

export default function Home() {
  const [activeView, setActiveView] = useState("projects");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black dark:bg-black light:bg-stone-light text-white dark:text-white light:text-gray-900 transition-colors">
      {/* Header */}
      <header className="border-b-4 border-amber-600 dark:border-amber-600 light:border-sage bg-black dark:bg-black light:bg-stone-light transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-amber-200 dark:text-amber-200 light:text-terracotta tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
                HARIPRIYA
              </h1>
              <p className="text-sm text-blue-300 dark:text-blue-300 light:text-sage-dark mt-2" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                OPEN SOURCE PROJECTS ◆ {new Date().toISOString().split('T')[0]}
              </p>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-6 py-3 bg-amber-600 dark:bg-amber-600 light:bg-sage hover:bg-amber-500 dark:hover:bg-amber-500 light:hover:bg-sage-light text-black dark:text-black light:text-white font-bold transition-colors"
              style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
            >
              {theme === "dark" ? "LIGHT" : "DARK"} MODE
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Side Navigation */}
        <Navigation activeView={activeView} setActiveView={setActiveView} />

        {/* Main Content */}
        <main className="flex-1 p-8 bg-black dark:bg-black light:bg-gray-50 overflow-auto transition-colors">
          <div className="max-w-4xl mx-auto">
            {activeView === "projects" && (
              <>
                <h2 className="text-3xl font-bold mb-8 text-amber-200 dark:text-amber-200 light:text-terracotta tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
                  OPERATIONAL PROJECTS
                </h2>
                <ProjectGrid projects={projectsData} />
              </>
            )}

            {activeView === "architecture" && <Architecture />}
            {activeView === "stack" && <TechStack />}
            {activeView === "updates" && <Updates />}
          </div>
        </main>

        {/* Right Panel - System Status */}
        <aside className="w-80 p-6 bg-gray-900 border-l-4 border-amber-600 flex-shrink-0">
          <SystemStatus />
        </aside>
      </div>
    </div>
  );
}