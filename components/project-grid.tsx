"use client";

import { motion } from "framer-motion";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "operational" | "beta" | "development";
  liveUrl?: string;
  sourceUrl?: string;
  technologies: string[];
}

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8">
      {projects.map((project, index) => (
        // @ts-ignore - React 19 compatibility issue with framer-motion
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group"
        >
          <div className="bg-gray-900 dark:bg-gray-900 light:bg-white border-2 border-amber-600 dark:border-amber-600 light:border-sage p-8 flex flex-col transition-colors" style={{borderRadius: '0 20px 20px 0', minHeight: '400px'}}>
            {/* Project Header */}
            <div className="mb-6 pb-4 border-b-2 border-amber-600/30 dark:border-amber-600/30 light:border-sage/30">
              <h3 className="text-2xl font-bold text-amber-200 dark:text-amber-200 light:text-terracotta uppercase tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
                {project.name}
              </h3>
              <div className="h-1 w-full bg-gradient-to-r from-amber-600 dark:from-amber-600 light:from-sage via-yellow-500 dark:via-yellow-500 light:via-sage-light to-transparent mt-3" />
            </div>

            {/* Project Description */}
            <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 mb-6 flex-grow leading-relaxed text-base" style={{fontFamily: 'Share Tech Mono, monospace'}}>
              {project.description}
            </p>

            {/* Status */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-sage/20 dark:bg-sage/20 light:bg-sage/30 text-sage-light dark:text-sage-light light:text-sage-dark rounded-full text-sm font-bold uppercase tracking-wide">
                ● {project.status.toUpperCase()}
              </span>
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-sm px-3 py-2 bg-amber-600/20 dark:bg-amber-600/20 light:bg-sage/20 text-amber-300 dark:text-amber-300 light:text-sage-dark rounded border border-amber-600/50 dark:border-amber-600/50 light:border-sage/50 font-medium"
                    style={{fontFamily: 'Share Tech Mono, monospace'}}
                  >
                    ▪ {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-auto">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-4 bg-amber-600 dark:bg-amber-600 light:bg-sage hover:bg-amber-500 dark:hover:bg-amber-500 light:hover:bg-sage-light text-black dark:text-black light:text-white font-bold uppercase tracking-wide transition-colors text-lg"
                  style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
                >
                  ACCESS LIVE
                </a>
              )}
              {project.sourceUrl && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-4 bg-sage dark:bg-sage light:bg-terracotta hover:bg-sage-light dark:hover:bg-sage-light light:hover:bg-terracotta-light text-white font-bold uppercase tracking-wide transition-colors text-lg"
                  style={{fontFamily: 'Antonio, sans-serif', borderRadius: '20px 4px 4px 20px'}}
                >
                  VIEW SOURCE
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}