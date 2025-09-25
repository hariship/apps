import { getClient } from './database';
import * as bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function seedDatabase() {
  const client = await getClient();

  try {
    // Begin transaction
    await client.query('BEGIN');

    // Create schema from SQL file
    const schemaSQL = readFileSync(join(process.cwd(), 'lib', 'schema.sql'), 'utf-8');
    await client.query(schemaSQL);

    // Clear existing data
    await client.query('DELETE FROM project_technologies');
    await client.query('DELETE FROM projects');
    await client.query('DELETE FROM technologies');
    await client.query('DELETE FROM integrations');
    await client.query('DELETE FROM users');

    // Seed Technologies
    const technologiesData = [
      ['Next.js', 'nextjs', 'framework', '#000000', 'nextjs', 'https://nextjs.org'],
      ['TypeScript', 'typescript', 'language', '#3178C6', 'typescript', 'https://typescriptlang.org'],
      ['React', 'react', 'frontend', '#61DAFB', 'react', 'https://reactjs.org'],
      ['Tailwind CSS', 'tailwindcss', 'frontend', '#06B6D4', 'tailwindcss', 'https://tailwindcss.com'],
      ['PostgreSQL', 'postgresql', 'database', '#336791', 'postgresql', 'https://postgresql.org'],
      ['Node.js', 'nodejs', 'backend', '#339933', 'nodejs', 'https://nodejs.org']
    ];

    for (const [name, slug, category, color, icon, website_url] of technologiesData) {
      await client.query(
        'INSERT INTO technologies (name, slug, category, color, icon, website_url) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, slug, category, color, icon, website_url]
      );
    }

    // Seed Integrations
    const integrationsData = [
      ['Vercel', 'vercel', 'Deployment and hosting platform', 'https://vercel.com', 'vercel', 'operational', '1.0.0'],
      ['Cloudflare Pages', 'cloudflare-pages', 'Edge deployment platform', 'https://pages.cloudflare.com', 'cloudflare', 'operational', '1.0.0'],
      ['GitHub', 'github', 'Source code repository', 'https://github.com', 'github', 'operational', null]
    ];

    for (const [name, slug, description, url, icon, status, version] of integrationsData) {
      await client.query(
        'INSERT INTO integrations (name, slug, description, url, icon, status, version) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [name, slug, description, url, icon, status, version]
      );
    }

    // Seed Project
    const architectureDiagram = `graph TB
    A[User Interface] --> B[Next.js App Router]
    B --> C[API Layer]
    C --> D[PostgreSQL Database]
    C --> E[External APIs]

    subgraph Frontend
        A
        B
        F[React Components]
        G[Tailwind CSS]
    end

    subgraph Backend
        C
        H[Authentication]
        I[Data Processing]
    end

    subgraph Data
        D
        E
        J[Real-time Updates]
    end`;

    const architectureCode = `// Architecture: Next.js 15 with App Router
// Frontend: React 19 + Tailwind CSS
// Backend: API Routes + PostgreSQL
// Auth: NextAuth.js
// Deployment: Vercel + Cloudflare

const architecture = {
  frontend: {
    framework: "Next.js 15",
    ui: "React 19",
    styling: "Tailwind CSS",
    theme: "next-themes"
  },
  backend: {
    api: "Next.js API Routes",
    database: "PostgreSQL + Supabase",
    auth: "NextAuth.js"
  },
  deployment: {
    primary: "Vercel",
    cdn: "Cloudflare Pages"
  }
};`;

    const projectResult = await client.query(`
      INSERT INTO projects (name, slug, description, long_description, live_url, source_url, image_url, status, featured, sort_order, architecture_diagram, architecture_code, tech_stack_description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `, [
      'Civic Pulse Dashboard',
      'civic-pulse-dashboard',
      'A comprehensive dashboard for tracking civic engagement metrics, voter turnout, and community participation across different regions.',
      'The Civic Pulse Dashboard is a data visualization platform that provides insights into civic engagement patterns. It aggregates data from multiple sources to present a clear picture of democratic participation, helping organizations and researchers understand trends in voter behavior and community involvement.',
      'https://civic-pulse-dashboard.haripriya.org',
      'https://github.com/your-username/civic-pulse-dashboard',
      '/projects/civic-pulse.jpg',
      'active',
      true,
      1,
      architectureDiagram,
      architectureCode,
      'Built with modern web technologies focusing on performance and scalability. Uses Next.js 15 with App Router for optimal SEO and loading speeds, React 19 for the latest features, and PostgreSQL for reliable data storage.'
    ]);

    const projectId = projectResult.rows[0].id;

    // Link project with technologies
    const techSlugs = ['nextjs', 'typescript', 'react', 'tailwindcss', 'postgresql'];
    for (const techSlug of techSlugs) {
      const techResult = await client.query('SELECT id FROM technologies WHERE slug = $1', [techSlug]);
      if (techResult.rows.length > 0) {
        const techId = techResult.rows[0].id;
        await client.query(
          'INSERT INTO project_technologies (project_id, technology_id) VALUES ($1, $2)',
          [projectId, techId]
        );
      }
    }

    // Seed Updates
    const updatesData = [
      [projectId, 'Initial Release', 'Launched the first version of Civic Pulse Dashboard with core features including data visualization, real-time metrics, and responsive design.', 'v1.0.0', 'feature'],
      [projectId, 'Performance Optimization', 'Improved loading speeds by 40% through code splitting and image optimization.', 'v1.1.0', 'performance'],
      [projectId, 'Dark Mode Support', 'Added comprehensive dark mode support with system preference detection.', 'v1.2.0', 'feature'],
      [projectId, 'Security Enhancement', 'Updated authentication system and added rate limiting for API endpoints.', 'v1.2.1', 'security']
    ];

    for (const [project_id, title, content, version, update_type] of updatesData) {
      await client.query(
        'INSERT INTO updates (project_id, title, content, version, update_type) VALUES ($1, $2, $3, $4, $5)',
        [project_id, title, content, version, update_type]
      );
    }

    // Seed Admin User
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    await client.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role, active)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      process.env.ADMIN_EMAIL || 'admin@haripriya.org',
      hashedPassword,
      'Hari',
      'Admin',
      'admin',
      true
    ]);

    // Commit transaction
    await client.query('COMMIT');
    console.log('Database seeded successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}