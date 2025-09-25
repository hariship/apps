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
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group"
          // @ts-ignore - React 19 compatibility issue with framer-motion
        >
          <div className="lcars-card p-6 h-full flex flex-col">
            {/* Project Header */}
            <div className="mb-4 pb-4 border-b-2 border-terracotta/30 dark:border-terracotta/30 light:border-sage/30">
              <h3 className="text-xl font-orbital font-semibold text-sand dark:text-sand light:text-stone-dark uppercase">
                {project.name}
              </h3>
              <div className="h-1 w-full bg-gradient-to-r from-terracotta via-sand to-transparent mt-2" />
            </div>

            {/* Project Description */}
            <p className="text-sm font-tech mb-4 flex-grow text-gray-300 dark:text-gray-300 light:text-gray-700">
              {project.description}
            </p>

            {/* Status */}
            <div className="mb-4">
              <span
                className={`
                  status-indicator
                  ${project.status === "operational" && "status-operational"}
                  ${project.status === "beta" && "status-beta"}
                  ${project.status === "development" && "status-development"}
                `}
              >
                ● {project.status.toUpperCase()}
              </span>
            </div>

            {/* Technologies */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-tech px-2 py-1 bg-terracotta/10 dark:bg-terracotta/10 light:bg-sage/10
                              text-terracotta dark:text-terracotta light:text-sage-dark rounded"
                  >
                    ▪ {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lcars-button text-white text-sm flex-1 text-center"
                >
                  ACCESS LIVE
                </a>
              )}
              {project.sourceUrl && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lcars-button bg-sage dark:bg-sage light:bg-terracotta text-white text-sm flex-1 text-center hover:bg-sage-light"
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