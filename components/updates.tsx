"use client";

import { motion } from "framer-motion";

const updates = [
  {
    date: "2024.09.25",
    entries: [
      "Apps Dashboard launched with theme support",
      "Integrated Vercel and Cloudflare deployment",
    ],
  },
  {
    date: "2024.09.20",
    entries: [
      "Civic Pulse v2.0 deployed to production",
      "Added real-time WebSocket support",
      "Performance improvements to caching layer",
    ],
  },
  {
    date: "2024.09.15",
    entries: [
      "Data Toolkit repository made public",
      "Documentation updated for API v3",
    ],
  },
  {
    date: "2024.09.10",
    entries: [
      "Rate Limiter library open sourced",
      "Added TypeScript definitions",
    ],
  },
];

export default function Updates() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-orbital text-sand dark:text-sand light:text-stone-dark mb-6">
        SYSTEM LOG ◆ RECENT UPDATES
      </h2>

      <div className="space-y-6">
        {updates.map((update, index) => (
          // @ts-ignore - React 19 compatibility
          <motion.div
            key={update.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="lcars-card p-6"
          >
            <div className="flex items-center mb-4">
              <span className="text-lg font-orbital text-terracotta">
                {update.date}
              </span>
              <div className="ml-4 flex-1 h-1 bg-gradient-to-r from-terracotta via-sand to-transparent" />
            </div>

            <ul className="space-y-2">
              {update.entries.map((entry, entryIndex) => (
                <li key={entryIndex} className="flex items-start">
                  <span className="text-sage mr-2">▪</span>
                  <span className="text-sm font-tech text-gray-300 dark:text-gray-300 light:text-gray-700">
                    {entry}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="lcars-card p-6 mt-8">
        <h3 className="text-lg font-orbital text-sand mb-4">
          DEPLOYMENT METRICS
        </h3>
        <div className="h-1 w-full bg-gradient-to-r from-terracotta via-sand to-transparent mb-4" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-tech text-sm">
          <div>
            <p className="text-gray-500 mb-1">COMMITS</p>
            <p className="text-2xl font-orbital text-terracotta">1,247</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">DEPLOYMENTS</p>
            <p className="text-2xl font-orbital text-sage">342</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">ISSUES CLOSED</p>
            <p className="text-2xl font-orbital text-dusty-blue">89</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">CONTRIBUTORS</p>
            <p className="text-2xl font-orbital text-sand">12</p>
          </div>
        </div>
      </div>
    </div>
  );
}