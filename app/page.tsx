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
    <div className="min-h-screen bg-black dark:bg-black light:bg-gray-50 transition-colors">
      <div className="scan-line" />

      {/* Header */}
      <header className="border-b-4 border-terracotta dark:border-terracotta light:border-sage">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-orbital font-bold text-sand dark:text-sand light:text-stone-dark">
                HARIPRIYA
              </h1>
              <p className="text-sm font-tech text-dusty-blue mt-1">
                OPEN SOURCE PROJECTS ◆ STARDATE {new Date().toISOString().split('T')[0]}
              </p>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="lcars-button text-white dark:text-white light:text-black"
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
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {activeView === "projects" && (
              <>
                <h2 className="text-2xl font-orbital mb-6 text-sand dark:text-sand light:text-stone-dark">
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
        <aside className="w-80 p-6 border-l-4 border-terracotta dark:border-terracotta light:border-sage">
          <SystemStatus />
        </aside>
      </div>
    </div>
  );
}