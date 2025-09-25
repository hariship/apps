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
    <div className="min-h-screen bg-black text-white dark:bg-black dark:text-white light:bg-gray-50 light:text-gray-900">
      {/* Header */}
      <header className="border-b-4 border-amber-600 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-amber-200 tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
                HARIPRIYA
              </h1>
              <p className="text-sm text-blue-300 mt-2" style={{fontFamily: 'Share Tech Mono, monospace'}}>
                OPEN SOURCE PROJECTS ◆ STARDATE {new Date().toISOString().split('T')[0]}
              </p>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-r-xl transition-colors"
              style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
            >
              {theme === "dark" ? "LIGHT" : "DARK"} MODE
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Side Navigation */}
        <Navigation activeView={activeView} setActiveView={setActiveView} />

        {/* Main Content */}
        <main className="flex-1 p-8 bg-black">
          <div className="max-w-6xl mx-auto">
            {activeView === "projects" && (
              <>
                <h2 className="text-3xl font-bold mb-8 text-amber-200 tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
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
        <aside className="w-80 p-6 bg-gray-900 border-l-4 border-amber-600">
          <SystemStatus />
        </aside>
      </div>
    </div>
  );
}