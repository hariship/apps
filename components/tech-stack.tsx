"use client";

import { motion } from "framer-motion";

const techCategories = [
  {
    name: "FRONTEND",
    color: "terracotta",
    technologies: ["React", "Next.js", "Vue", "Svelte", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "BACKEND",
    color: "sage",
    technologies: ["Node.js", "Python", "Go", "FastAPI", "Express", "GraphQL"],
  },
  {
    name: "DATABASE",
    color: "dusty-blue",
    technologies: ["PostgreSQL", "MongoDB", "Redis", "SQLite", "Prisma"],
  },
  {
    name: "DEVOPS",
    color: "sand",
    technologies: ["Docker", "Kubernetes", "CI/CD", "Terraform", "AWS", "Vercel"],
  },
  {
    name: "TOOLS",
    color: "stone",
    technologies: ["Git", "Webpack", "ESLint", "Prettier", "Jest", "Vite"],
  },
];

export default function TechStack() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-orbital text-sand dark:text-sand light:text-stone-dark mb-6">
        TECHNOLOGY MANIFEST
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="lcars-card p-6"
          >
            <h3
              className={`text-lg font-orbital mb-4 ${
                category.color === "terracotta" && "text-terracotta"
              } ${category.color === "sage" && "text-sage"} ${
                category.color === "dusty-blue" && "text-dusty-blue"
              } ${category.color === "sand" && "text-sand"} ${
                category.color === "stone" && "text-stone"
              }`}
            >
              {category.name}
            </h3>
            <div
              className={`h-1 w-full mb-4 ${
                category.color === "terracotta" && "bg-terracotta"
              } ${category.color === "sage" && "bg-sage"} ${
                category.color === "dusty-blue" && "bg-dusty-blue"
              } ${category.color === "sand" && "bg-sand"} ${
                category.color === "stone" && "bg-stone"
              }`}
            />

            <ul className="space-y-2">
              {category.technologies.map((tech, techIndex) => (
                <motion.li
                  key={tech}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: categoryIndex * 0.1 + techIndex * 0.05 }}
                  className="flex items-center text-sm font-tech"
                >
                  <span className={`mr-2 ${
                    category.color === "terracotta" && "text-terracotta"
                  } ${category.color === "sage" && "text-sage"} ${
                    category.color === "dusty-blue" && "text-dusty-blue"
                  } ${category.color === "sand" && "text-sand"} ${
                    category.color === "stone" && "text-stone"
                  }`}>
                    ▪
                  </span>
                  <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                    {tech}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="lcars-card p-8 mt-8">
        <h3 className="text-lg font-orbital text-sand mb-4">
          DEPLOYMENT INFRASTRUCTURE
        </h3>
        <div className="h-1 w-full bg-gradient-to-r from-terracotta via-sand to-transparent mb-6" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="h-20 w-20 mx-auto mb-2 rounded-full bg-terracotta/20 flex items-center justify-center">
              <span className="text-2xl font-orbital text-terracotta">V</span>
            </div>
            <p className="font-tech text-sm">Vercel</p>
          </div>
          <div className="text-center">
            <div className="h-20 w-20 mx-auto mb-2 rounded-full bg-sage/20 flex items-center justify-center">
              <span className="text-2xl font-orbital text-sage">CF</span>
            </div>
            <p className="font-tech text-sm">Cloudflare</p>
          </div>
          <div className="text-center">
            <div className="h-20 w-20 mx-auto mb-2 rounded-full bg-dusty-blue/20 flex items-center justify-center">
              <span className="text-2xl font-orbital text-dusty-blue">GH</span>
            </div>
            <p className="font-tech text-sm">GitHub</p>
          </div>
          <div className="text-center">
            <div className="h-20 w-20 mx-auto mb-2 rounded-full bg-sand/20 flex items-center justify-center">
              <span className="text-2xl font-orbital text-sand">D</span>
            </div>
            <p className="font-tech text-sm">Docker</p>
          </div>
        </div>
      </div>
    </div>
  );
}