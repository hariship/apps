import { NextResponse } from 'next/server';
import { getClient } from '@/lib/database';

export async function POST() {
  const client = await getClient();

  try {
    // Add new columns to projects table
    await client.query('ALTER TABLE projects ADD COLUMN IF NOT EXISTS architecture_diagram TEXT');
    await client.query('ALTER TABLE projects ADD COLUMN IF NOT EXISTS architecture_code TEXT');
    await client.query('ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_stack_description TEXT');

    // Create updates table if it doesn't exist
    await client.query(`
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
      )
    `);

    // Create index on updates for better performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_updates_project_id ON updates(project_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_updates_published ON updates(published)');

    return NextResponse.json({
      success: true,
      message: 'Database migrated successfully'
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to migrate database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}