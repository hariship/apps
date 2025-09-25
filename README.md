# Apps Dashboard

A modern portfolio dashboard built with Next.js 15 for showcasing development projects with interactive architecture diagrams and real-time GitHub integration.

## Features

- **Project Showcase**: Display projects with descriptions, tech stacks, and live links
- **Interactive Architecture Diagrams**: Mermaid.js diagrams with mobile-optimized modal view
- **Real-time GitHub Integration**: Live commit feeds from all project repositories
- **Responsive Design**: Mobile-first approach with LCARS-inspired theme
- **Dark/Light Theme**: Toggle between themes with system preference support
- **Database-driven**: PostgreSQL backend with Supabase integration

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom LCARS theme
- **Database**: PostgreSQL via Supabase
- **Diagrams**: Mermaid.js for architecture visualization
- **Authentication**: NextAuth.js (optional admin panel)
- **Deployment**: Cloudflare Pages / Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)

### Installation

1. Clone the repository:
```bash
git clone git@github.com:hariship/apps.git
cd apps
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Configure your `.env` file with:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Authentication secret (optional)
- `GITHUB_TOKEN` - GitHub API token for higher rate limits (optional)

4. Set up the database:
```bash
npm run migrate
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.

## Project Structure

```
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   ├── project/[slug]/    # Dynamic project pages
│   └── admin/             # Admin panel (optional)
├── components/            # React components
├── lib/                   # Database utilities
└── types/                 # TypeScript definitions
```

## Key Features

### Architecture Diagrams
- Mobile-optimized with expandable modal view
- Mermaid.js integration with theme support
- Click to expand on mobile devices

### Recent Commits
- Fetches commits from all project repositories
- Shows project badges for context
- Smart "Lead Developer" based on recent activity

### Responsive Design
- Mobile-first approach
- Custom scrollbars with theme colors
- LCARS-inspired UI elements

## Commands

```bash
npm run dev              # Development server
npm run build            # Production build
npm run start            # Production server
npm run lint             # ESLint
npm run type-check       # TypeScript check
npm run migrate          # Database migration
npm run seed             # Seed database
```

## Deployment

### Cloudflare Pages
```bash
npm run build:cf
```

### Vercel
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.