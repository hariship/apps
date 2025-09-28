# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server
npm run dev

# Production build (standard)
npm run build

# Production build (Cloudflare Pages)
npm run build:cf

# Start production server
npm run start

# Linting
npm run lint

# TypeScript type checking
npm run type-check
```

## Architecture Overview

This is a Next.js 15 portfolio dashboard built with React 19, TypeScript, and PostgreSQL. The application showcases development projects with real-time GitHub integration, interactive Mermaid.js architecture diagrams, and a mobile-optimized LCARS-inspired theme.

### Core Architecture Patterns

**Database-First Design**: The application uses PostgreSQL with a connection pool pattern (`lib/database.ts`). All data operations go through API routes that interact with the database via the pool singleton pattern.

**API Route Structure**:
- `/api/projects/*` - Project CRUD operations
- `/api/technologies/*` - Technology/tech stack management
- `/api/github-commits` - Real-time GitHub commit fetching from multiple repositories
- `/api/migrate` and `/api/seed` - Database setup and seeding
- `/api/auth/[...nextauth]` - NextAuth.js authentication (optional admin panel)

**Real-time GitHub Integration**: The dashboard fetches commits from ALL project repositories (not just the apps dashboard), aggregates them by date, and displays them with project badges. The system calculates a "Lead Developer" based on commit frequency from recent activity.

**Theme System**: Uses a custom blue color scheme (changed from original orange) with `next-themes` for dark/light mode switching. The theme is LCARS-inspired with custom Tailwind colors defined in `tailwind.config.ts`:
- `terracotta: #6b8caf` (main blue accent)
- Custom fonts: Antonio (display), Share Tech Mono (monospace), Orbitron (headers)

**Mobile-First Responsive Design**: Architecture diagrams use Mermaid.js with mobile-optimized modal overlays. Mobile transforms and viewport handling are implemented in `globals.css`.

### Key Data Flow

1. **Project Loading**: `app/page.tsx` fetches projects from `/api/projects`
2. **Commit Aggregation**: For each project with a GitHub source_url, fetch commits from `/api/github-commits?repo={owner/repo}&limit=3`
3. **Lead Developer Calculation**: Count commits by author from aggregated data, display author with most commits
4. **Dynamic Routing**: Individual project pages at `/project/[slug]` show detailed project info with expandable architecture diagrams

### Environment Variables

Required in `.env` or `.env.local`:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Authentication secret (optional)
- `GITHUB_TOKEN` - GitHub personal access token for higher API rate limits (recommended to avoid 60/hour unauthenticated limit)

### GitHub API Rate Limiting

The GitHub commits API has strict rate limits:
- Unauthenticated: 60 requests/hour per IP
- Authenticated: 5,000 requests/hour

Since the app fetches from multiple repositories simultaneously, add a GitHub token to avoid rate limiting. Uncomment the Authorization header in `app/api/github-commits/route.ts` when token is added.

### Database Schema

Tables include:
- `projects` - Project information with slug-based routing
- `technologies` - Tech stack items with categories and colors
- `project_technologies` - Many-to-many relationship
- Additional admin tables for integrations and metadata

## Git Workflow Notes

- Never use `git add .` - always specify files explicitly
- CLAUDE.md should remain untracked and not be committed
- Commit messages should be concise without Claude co-authorship lines unless explicitly requested
- The git author is configured to use "hariship" as the username