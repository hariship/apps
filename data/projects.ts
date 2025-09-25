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
  {
    id: "data-toolkit",
    name: "Data Visualization Toolkit",
    description: "Comprehensive toolkit for creating interactive data visualizations. Includes custom React components and utilities for charts, graphs, and dashboards.",
    status: "operational",
    liveUrl: "https://data-viz.haripriya.org/",
    sourceUrl: "https://github.com/haripriya/data-viz-toolkit",
    technologies: ["React", "TypeScript", "D3.js", "Canvas", "WebGL"],
  },
  {
    id: "api-limiter",
    name: "Smart Rate Limiter",
    description: "Intelligent API rate limiting library with Redis backend. Features adaptive limiting, burst handling, and detailed analytics.",
    status: "operational",
    sourceUrl: "https://github.com/haripriya/smart-rate-limiter",
    technologies: ["Node.js", "Redis", "TypeScript", "Express"],
  },
  {
    id: "monitoring-suite",
    name: "Monitoring Suite",
    description: "Comprehensive monitoring and alerting system for microservices. Real-time metrics, custom dashboards, and intelligent alerts.",
    status: "beta",
    liveUrl: "https://monitoring.haripriya.org/",
    sourceUrl: "https://github.com/haripriya/monitoring-suite",
    technologies: ["Go", "Prometheus", "Grafana", "Docker", "K8s"],
  },
  {
    id: "auth-module",
    name: "Universal Auth Module",
    description: "Modular authentication system supporting OAuth2, SAML, and custom providers. Zero-config setup with enterprise-grade security.",
    status: "development",
    sourceUrl: "https://github.com/haripriya/universal-auth",
    technologies: ["Node.js", "TypeScript", "JWT", "OAuth2", "SAML"],
  },
  {
    id: "deployment-tools",
    name: "DevOps Toolkit",
    description: "Automated deployment and infrastructure management tools. Supports multiple cloud providers with GitOps workflows.",
    status: "beta",
    sourceUrl: "https://github.com/haripriya/devops-toolkit",
    technologies: ["Python", "Terraform", "Ansible", "Docker", "CI/CD"],
  },
];