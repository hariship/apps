"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

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

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="relative group animate-fade-in-up cursor-pointer"
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => router.push(`/project/${project.slug}`)}
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-terracotta p-4 flex flex-col transition-colors" style={{borderRadius: '0 15px 15px 0', minHeight: '280px'}}>
            {/* Project Header */}
            <div className="mb-3 pb-2 border-b border-gray-300/50 dark:border-terracotta/30">
              <h3 className="text-lg font-bold text-terracotta dark:text-terracotta uppercase tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
                {project.name}
              </h3>
              <div className="h-0.5 w-full bg-gradient-to-r from-gray-400 dark:from-terracotta via-gray-500 dark:via-terracotta-light to-transparent mt-2" />
            </div>

            {/* Project Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-3 flex-grow leading-relaxed text-sm" style={{fontFamily: 'Share Tech Mono, monospace'}}>
              {project.description}
            </p>

            {/* Status */}
            <div className="mb-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-sage/20 text-gray-700 dark:text-sage-light rounded text-xs font-bold uppercase tracking-wide">
                ● {project.status.toUpperCase()}
              </span>
            </div>

            {/* Technologies */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech.id}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-terracotta/20 text-gray-700 dark:text-terracotta rounded border border-gray-300 dark:border-terracotta/50 font-medium"
                    style={{fontFamily: 'Share Tech Mono, monospace'}}
                  >
                    {tech.name}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="text-xs px-2 py-1 text-gray-500">
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-3 py-2 bg-gray-500 dark:bg-terracotta hover:bg-gray-600 dark:hover:bg-terracotta-light text-white dark:text-black text-xs font-bold uppercase tracking-wide transition-colors"
                  style={{fontFamily: 'Antonio, sans-serif', borderRadius: '15px 3px 3px 15px'}}
                >
                  LIVE
                </a>
              )}
              {project.source_url && (
                <a
                  href={project.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-3 py-2 bg-terracotta dark:bg-gray-500 hover:bg-terracotta-light dark:hover:bg-gray-400 text-white text-xs font-bold uppercase tracking-wide transition-colors"
                  style={{fontFamily: 'Antonio, sans-serif', borderRadius: '15px 3px 3px 15px'}}
                >
                  SOURCE
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}