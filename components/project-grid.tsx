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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        // @ts-ignore - React 19 compatibility issue with framer-motion
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group"
        >
          <div className="bg-gray-900 border-2 border-amber-600 p-8 h-full flex flex-col" style={{borderRadius: '0 20px 20px 0'}}>
            {/* Project Header */}
            <div className="mb-6 pb-4 border-b-2 border-amber-600/30">
              <h3 className="text-2xl font-bold text-amber-200 uppercase tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
                {project.name}
              </h3>
              <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-transparent mt-3" />
            </div>

            {/* Project Description */}
            <p className="text-gray-300 mb-6 flex-grow leading-relaxed" style={{fontFamily: 'Share Tech Mono, monospace'}}>
              {project.description}
            </p>

            {/* Status */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-bold uppercase tracking-wide">
                ● {project.status.toUpperCase()}
              </span>
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1 bg-amber-600/20 text-amber-300 rounded border border-amber-600/50"
                    style={{fontFamily: 'Share Tech Mono, monospace'}}
                  >
                    ▪ {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold uppercase tracking-wide transition-colors"
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
                  className="flex-1 text-center px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-wide transition-colors"
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