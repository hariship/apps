import { getClient } from './database';
import * as bcrypt from 'bcryptjs';

export async function seedCivicPulse() {
  const client = await getClient();

  try {
    // Begin transaction
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM updates');
    await client.query('DELETE FROM project_technologies');
    await client.query('DELETE FROM projects');
    await client.query('DELETE FROM technologies');
    await client.query('DELETE FROM integrations');
    await client.query('DELETE FROM users');

    // Seed Technologies for Apps Dashboard
    const technologiesData = [
      ['Next.js', 'nextjs', 'frontend', '#000000', 'nextjs', 'https://nextjs.org'],
      ['TypeScript', 'typescript', 'frontend', '#3178C6', 'typescript', 'https://typescriptlang.org'],
      ['React', 'react', 'frontend', '#61DAFB', 'react', 'https://reactjs.org'],
      ['Tailwind CSS', 'tailwindcss', 'frontend', '#06B6D4', 'tailwindcss', 'https://tailwindcss.com'],
      ['PostgreSQL', 'postgresql', 'backend', '#336791', 'postgresql', 'https://postgresql.org'],
      ['Supabase', 'supabase', 'backend', '#3ECF8E', 'supabase', 'https://supabase.com'],
      ['NextAuth.js', 'nextauth', 'backend', '#7C3AED', 'nextauth', 'https://next-auth.js.org'],
      ['Mermaid', 'mermaid', 'frontend', '#2563EB', 'mermaid', 'https://mermaid.js.org'],
      ['Cloudflare', 'cloudflare', 'devops', '#1E40AF', 'cloudflare', 'https://cloudflare.com']
    ];

    for (const [name, slug, category, color, icon, website_url] of technologiesData) {
      await client.query(
        'INSERT INTO technologies (name, slug, category, color, icon, website_url) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, slug, category, color, icon, website_url]
      );
    }

    // Remove global integrations - will be project-specific infrastructure

    // Apps Dashboard Architecture Diagram (simplified for performance)
    const appsArchitecture = `graph LR
    A[Next.js Frontend] --> B[API Routes]
    B --> C[Supabase Database]
    A --> D[NextAuth]
    A --> E[Mermaid]
    C --> F[Projects]
    C --> G[Technologies]
    C --> H[Updates]
    I[Cloudflare] --> A`;

    // Civic Pulse Architecture Diagram
    const civicPulseArchitecture = `graph TB
    A[React Frontend] --> B[Node.js API]
    B --> C[MongoDB Database]
    A --> D[Chart.js Visualizations]
    B --> E[Data Processing Engine]
    E --> F[External APIs]

    subgraph Frontend
        A
        D
        G[Material-UI]
    end

    subgraph Backend
        B
        E
        H[Express Server]
    end

    subgraph Data
        C
        F
        I[Real-time Updates]
    end`;

    // Seed Civic Pulse Project (first)
    const civicProjectResult = await client.query(`
      INSERT INTO projects (
        name, slug, description, long_description, live_url, source_url,
        image_url, status, featured, sort_order,
        architecture_diagram, architecture_code, tech_stack_description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `, [
      'Civic Pulse',
      'civic-pulse',
      'A comprehensive dashboard for tracking civic engagement metrics, voter turnout, and community participation across different regions.',
      'Civic Pulse is a data visualization platform that provides insights into civic engagement patterns. It aggregates data from multiple sources to present a clear picture of democratic participation, helping organizations and researchers understand trends in voter behavior and community involvement across various demographics and geographic regions.',
      'https://civic-pulse-dashboard.haripriya.org',
      'https://github.com/hariship/civic-pulse',
      '/projects/civic-pulse.jpg',
      'active',
      true,
      1,
      civicPulseArchitecture,
      null,
      'Data-driven civic engagement platform built with React and Node.js. Features interactive Chart.js visualizations, Material-UI components, and MongoDB for scalable data storage. Includes real-time data processing engine for aggregating civic metrics from multiple sources and APIs.'
    ]);

    const civicProjectId = civicProjectResult.rows[0].id;

    // Link Civic Pulse with technologies
    const civicTechSlugs = ['react', 'nodejs', 'typescript', 'tailwindcss'];
    for (const techSlug of civicTechSlugs) {
      const techResult = await client.query('SELECT id FROM technologies WHERE slug = $1', [techSlug]);
      if (techResult.rows.length > 0) {
        const techId = techResult.rows[0].id;
        await client.query(
          'INSERT INTO project_technologies (project_id, technology_id) VALUES ($1, $2)',
          [civicProjectId, techId]
        );
      }
    }

    // Seed Apps Dashboard Project (second)
    const appsProjectResult = await client.query(`
      INSERT INTO projects (
        name, slug, description, long_description, live_url, source_url,
        image_url, status, featured, sort_order,
        architecture_diagram, architecture_code, tech_stack_description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `, [
      'Apps Dashboard',
      'apps-dashboard',
      'A modern portfolio dashboard for managing and showcasing development projects with interactive architecture diagrams and technology stack visualization.',
      'The Apps Dashboard is a full-stack portfolio management platform built with Next.js 15 and React 19. It features a Star Trek LCARS-inspired design with dark/light mode support, interactive Mermaid diagrams for system architecture visualization, and comprehensive project management capabilities. The dashboard integrates with PostgreSQL via Supabase for data persistence and includes NextAuth.js for authentication.',
      'http://localhost:3000',
      'https://github.com/hariship/apps',
      '/projects/apps-dashboard.jpg',
      'active',
      true,
      2,
      appsArchitecture,
      null, // No separate architecture code - we use mermaid diagram
      'Portfolio dashboard showcasing development projects with real-time GitHub integration. Built with Next.js 15 App Router, React 19, and TypeScript. Features LCARS-inspired design with Tailwind CSS, dynamic Mermaid.js architecture diagrams, and live commit feeds from GitHub API. Data layer powered by PostgreSQL via Supabase, with NextAuth.js for authentication. Deployed on Cloudflare Pages.'
    ]);

    const appsProjectId = appsProjectResult.rows[0].id;

    // Link project with correct technologies
    const techSlugs = ['nextjs', 'typescript', 'react', 'tailwindcss', 'postgresql', 'supabase', 'nextauth', 'mermaid', 'cloudflare'];
    for (const techSlug of techSlugs) {
      const techResult = await client.query('SELECT id FROM technologies WHERE slug = $1', [techSlug]);
      if (techResult.rows.length > 0) {
        const techId = techResult.rows[0].id;
        await client.query(
          'INSERT INTO project_technologies (project_id, technology_id) VALUES ($1, $2)',
          [appsProjectId, techId]
        );
      }
    }

    // Add Apps Dashboard Infrastructure (for current project)
    const appsInfrastructure = [
      ['Cloudflare Pages', 'cloudflare-pages', 'Frontend deployment and CDN', 'https://pages.cloudflare.com', 'cloudflare', 'operational', '1.0.0'],
      ['Supabase', 'supabase', 'PostgreSQL database hosting', 'https://supabase.com', 'supabase', 'operational', '2.0.0'],
      ['GitHub', 'github', 'Source code repository', 'https://github.com/hariship/apps', 'github', 'operational', null]
    ];

    for (const [name, slug, description, url, icon, status, version] of appsInfrastructure) {
      await client.query(
        'INSERT INTO integrations (name, slug, description, url, icon, status, version) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [name, slug, description, url, icon, status, version]
      );
    }

    // Seed Updates for Apps Dashboard (based on actual git history)
    const updatesData = [
      [appsProjectId, 'Initial Dashboard Setup with Star Trek Theme', 'Set up the foundational dashboard architecture with Star Trek LCARS-inspired theme, implemented the basic layout structure and established the design system with earthy color palette.', 'v1.0.0', 'feature'],
      [appsProjectId, 'React 19 Compatibility Issues Fixed', 'Resolved compatibility issues with Framer Motion and React 19, updated all animation components to work seamlessly with the latest React version and improved component lifecycle management.', 'v1.1.0', 'bugfix'],
      [appsProjectId, 'Styling and UI Layout Improvements', 'Enhanced UI layout responsiveness, fixed styling inconsistencies across different screen sizes, and improved the overall visual hierarchy of dashboard components.', 'v1.2.0', 'feature'],
      [appsProjectId, 'Tailwind CSS Loading Issues Resolved', 'Fixed critical Tailwind CSS loading problems that were causing style inconsistencies, optimized CSS bundle size, and improved initial page load performance.', 'v1.2.1', 'bugfix'],
      [appsProjectId, 'Complete Light/Dark Theme Support', 'Implemented comprehensive light and dark theme switching functionality with proper color scheme management, theme persistence, and seamless transitions between modes.', 'v1.3.0', 'feature']
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
    console.log('Apps Dashboard database seeded successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}