"use client";

import { useEffect, useState } from "react";

export default function SystemStatus() {
  const [uptime, setUptime] = useState("99.9%");
  const [projects, setProjects] = useState(1);
  const [live, setLive] = useState(1);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 dark:bg-gray-800 light:bg-stone-light border-2 border-amber-600 dark:border-amber-600 light:border-sage p-6 transition-colors" style={{borderRadius: '0 20px 20px 0'}}>
        <h3 className="text-lg font-bold text-amber-200 dark:text-amber-200 light:text-terracotta mb-4 uppercase tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
          SYSTEM STATUS
        </h3>
        <div className="h-1 w-full bg-gradient-to-r from-amber-600 dark:from-amber-600 light:from-sage via-yellow-500 dark:via-yellow-500 light:via-sage-light to-transparent mb-4" />

        <div className="space-y-3 text-sm" style={{fontFamily: 'Share Tech Mono, monospace'}}>
          <div className="flex justify-between">
            <span className="text-gray-400 dark:text-gray-400 light:text-gray-600">PROJECTS ONLINE</span>
            <span className="text-sage-light dark:text-sage-light light:text-sage-dark font-bold">{live}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 dark:text-gray-400 light:text-gray-600">TOTAL PROJECTS</span>
            <span className="text-amber-400 dark:text-amber-400 light:text-terracotta font-bold">{projects}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 dark:text-gray-400 light:text-gray-600">UPTIME</span>
            <span className="text-terracotta-light dark:text-terracotta-light light:text-terracotta font-bold">{uptime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 dark:text-gray-400 light:text-gray-600">RESPONSE TIME</span>
            <span className="text-blue-400 dark:text-blue-400 light:text-blue-600 font-bold">12ms</span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-600 uppercase" style={{fontFamily: 'Share Tech Mono, monospace'}}>SYSTEM LOAD</div>
          <div className="flex gap-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`h-4 w-full ${
                  i < 6
                    ? "bg-sage dark:bg-sage light:bg-sage"
                    : "bg-gray-700 dark:bg-gray-700 light:bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 dark:bg-gray-800 light:bg-stone-light border-2 border-amber-600 dark:border-amber-600 light:border-sage p-6 transition-colors" style={{borderRadius: '0 20px 20px 0'}}>
        <h3 className="text-lg font-bold text-amber-200 dark:text-amber-200 light:text-terracotta mb-4 uppercase tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
          INTEGRATIONS
        </h3>
        <div className="h-1 w-full bg-gradient-to-r from-amber-600 dark:from-amber-600 light:from-sage via-yellow-500 dark:via-yellow-500 light:via-sage-light to-transparent mb-4" />

        <div className="space-y-2 text-sm" style={{fontFamily: 'Share Tech Mono, monospace'}}>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">▪ GitHub API</span>
            <span className="text-sage-light dark:text-sage-light light:text-sage-dark text-xs font-bold">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">▪ Vercel Analytics</span>
            <span className="text-sage-light dark:text-sage-light light:text-sage-dark text-xs font-bold">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">▪ Cloudflare CDN</span>
            <span className="text-sage-light dark:text-sage-light light:text-sage-dark text-xs font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}