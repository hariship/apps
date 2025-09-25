"use client";

import { useEffect, useState } from "react";

export default function SystemStatus() {
  const [uptime, setUptime] = useState("99.9%");
  const [projects, setProjects] = useState(6);
  const [live, setLive] = useState(4);

  return (
    <div className="space-y-6">
      <div className="lcars-card p-6">
        <h3 className="text-lg font-orbital text-sand dark:text-sand light:text-stone-dark mb-4">
          SYSTEM STATUS
        </h3>
        <div className="h-1 w-full bg-gradient-to-r from-terracotta via-sand to-transparent mb-4" />

        <div className="space-y-3 font-tech text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">PROJECTS ONLINE</span>
            <span className="text-sage">{live}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">TOTAL PROJECTS</span>
            <span className="text-sand">{projects}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">UPTIME</span>
            <span className="text-terracotta">{uptime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">RESPONSE TIME</span>
            <span className="text-dusty-blue">12ms</span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="text-xs font-tech text-gray-500">SYSTEM LOAD</div>
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

      <div className="lcars-card p-6">
        <h3 className="text-lg font-orbital text-sand dark:text-sand light:text-stone-dark mb-4">
          INTEGRATIONS
        </h3>
        <div className="h-1 w-full bg-gradient-to-r from-terracotta via-sand to-transparent mb-4" />

        <div className="space-y-2 font-tech text-sm">
          <div className="flex items-center justify-between">
            <span>▪ GitHub API</span>
            <span className="text-sage text-xs">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span>▪ Vercel Analytics</span>
            <span className="text-sage text-xs">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span>▪ Cloudflare CDN</span>
            <span className="text-sage text-xs">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}