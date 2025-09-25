"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function Architecture() {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      theme: "dark",
      themeVariables: {
        primaryColor: "#8B4513",
        primaryBorderColor: "#D2B48C",
        primaryTextColor: "#fff",
        lineColor: "#87A96B",
        background: "#000",
        mainBkg: "#1a1a1a",
        secondBkg: "#2a2a2a",
      },
    });

    if (mermaidRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  const diagram = `
    graph TD
      subgraph "APPLICATIONS"
        A[Apps Dashboard]
        B[Civic Pulse]
        C[Data Toolkit]
        D[API Limiter]
        E[Monitoring Tools]
      end

      subgraph "INFRASTRUCTURE"
        F[(PostgreSQL)]
        G[Redis Cache]
        H[Nginx]
        I[Docker/K8s]
      end

      subgraph "EXTERNAL SERVICES"
        J[GitHub API]
        K[Vercel]
        L[Cloudflare]
      end

      A --> F
      B --> F
      B --> G
      C --> F
      D --> G
      E --> I

      A --> J
      A --> K
      A --> L
  `;

  return (
    <div className="space-y-6">
      <div className="lcars-card p-8">
        <h2 className="text-2xl font-orbital text-sand dark:text-sand light:text-stone-dark mb-4">
          SYSTEM ARCHITECTURE
        </h2>
        <div className="h-1 w-full bg-gradient-to-r from-terracotta via-sand to-transparent mb-6" />

        <div className="bg-black/50 dark:bg-black/50 light:bg-white/50 rounded-lg p-8">
          <div ref={mermaidRef} className="mermaid">
            {diagram}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="lcars-card p-4">
            <h3 className="font-orbital text-terracotta mb-2">APPLICATIONS</h3>
            <p className="text-sm font-tech text-gray-400">
              Frontend applications and services
            </p>
          </div>
          <div className="lcars-card p-4">
            <h3 className="font-orbital text-sage mb-2">INFRASTRUCTURE</h3>
            <p className="text-sm font-tech text-gray-400">
              Core backend services and databases
            </p>
          </div>
          <div className="lcars-card p-4">
            <h3 className="font-orbital text-dusty-blue mb-2">EXTERNAL</h3>
            <p className="text-sm font-tech text-gray-400">
              Third-party integrations and APIs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}