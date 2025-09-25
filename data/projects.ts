export interface Project {
  id: string;
  name: string;
  description: string;
  status: "operational" | "beta" | "development";
  liveUrl?: string;
  sourceUrl?: string;
  technologies: string[];
}

export const projectsData: Project[] = [
  {
    id: "civic-pulse",
    name: "Civic Pulse Dashboard",
    description: "Real-time civic data monitoring and visualization platform. Provides dashboards for public services, infrastructure status, and community metrics.",
    status: "operational",
    liveUrl: "https://civic-pulse-dashboard.haripriya.org/",
    sourceUrl: "https://github.com/haripriya/civic-pulse-dashboard",
    technologies: ["React", "D3.js", "PostgreSQL", "Node.js", "WebSocket"],
  },
];