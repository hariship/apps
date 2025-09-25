-- Create tables with snake_case naming
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS technologies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(30) DEFAULT 'tool' CHECK (category IN ('frontend', 'backend', 'database', 'devops', 'tool', 'framework', 'language')),
    color VARCHAR(7) DEFAULT '#6B7280',
    icon VARCHAR(50),
    website_url VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    live_url VARCHAR(255) NOT NULL,
    source_url VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'archived')),
    featured BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    architecture_diagram TEXT,
    architecture_code TEXT,
    tech_stack_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS updates (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    version VARCHAR(50),
    update_type VARCHAR(20) DEFAULT 'feature' CHECK (update_type IN ('feature', 'bugfix', 'security', 'performance', 'breaking')),
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS integrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    url VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    status VARCHAR(20) DEFAULT 'operational' CHECK (status IN ('operational', 'degraded', 'outage')),
    version VARCHAR(20),
    last_checked TIMESTAMP,
    enabled BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_technologies (
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    technology_id INTEGER REFERENCES technologies(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, technology_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_technologies_category ON technologies(category);
CREATE INDEX IF NOT EXISTS idx_integrations_enabled ON integrations(enabled);