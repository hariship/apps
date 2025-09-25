"use client";

import { useEffect, useState } from "react";

export default function SystemStatus() {
  const [uptime, setUptime] = useState("99.9%");
  const [projects, setProjects] = useState(1);
  const [live, setLive] = useState(1);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 border-2 border-amber-600 p-6" style={{borderRadius: '0 20px 20px 0'}}>
        <h3 className="text-lg font-bold text-amber-200 mb-4 uppercase tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
          SYSTEM STATUS
        </h3>
        <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-transparent mb-4" />

        <div className="space-y-3 text-sm" style={{fontFamily: 'Share Tech Mono, monospace'}}>
          <div className="flex justify-between">
            <span className="text-gray-400">PROJECTS ONLINE</span>
            <span className="text-green-400 font-bold">{live}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">TOTAL PROJECTS</span>
            <span className="text-amber-400 font-bold">{projects}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">UPTIME</span>
            <span className="text-orange-400 font-bold">{uptime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">RESPONSE TIME</span>
            <span className="text-blue-400 font-bold">12ms</span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="text-xs text-gray-500 uppercase" style={{fontFamily: 'Share Tech Mono, monospace'}}>SYSTEM LOAD</div>
          <div className="flex gap-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`h-4 w-full ${
                  i < 6
                    ? "bg-green-500"
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border-2 border-amber-600 p-6" style={{borderRadius: '0 20px 20px 0'}}>
        <h3 className="text-lg font-bold text-amber-200 mb-4 uppercase tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
          INTEGRATIONS
        </h3>
        <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-transparent mb-4" />

        <div className="space-y-2 text-sm" style={{fontFamily: 'Share Tech Mono, monospace'}}>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">▪ GitHub API</span>
            <span className="text-green-400 text-xs font-bold">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">▪ Vercel Analytics</span>
            <span className="text-green-400 text-xs font-bold">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">▪ Cloudflare CDN</span>
            <span className="text-green-400 text-xs font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}