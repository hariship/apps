import { NextResponse } from 'next/server';
import { getClient } from '@/lib/database';

export async function GET() {
  const client = await getClient();

  try {
    const result = await client.query(`
      SELECT
        p.id, p.name, p.slug, p.description, p.long_description,
        p.live_url, p.source_url, p.image_url, p.status, p.featured,
        p.sort_order, p.architecture_diagram, p.architecture_code, p.tech_stack_description,
        p.created_at, p.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id,
              'name', t.name,
              'slug', t.slug,
              'category', t.category,
              'color', t.color,
              'icon', t.icon,
              'website_url', t.website_url
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as technologies
      FROM projects p
      LEFT JOIN project_technologies pt ON p.id = pt.project_id
      LEFT JOIN technologies t ON pt.technology_id = t.id
      GROUP BY p.id, p.name, p.slug, p.description, p.long_description,
               p.live_url, p.source_url, p.image_url, p.status, p.featured,
               p.sort_order, p.architecture_diagram, p.architecture_code, p.tech_stack_description,
               p.created_at, p.updated_at
      ORDER BY p.sort_order ASC, p.created_at DESC
    `);

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects'
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const client = await getClient();

  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      long_description,
      live_url,
      source_url,
      image_url,
      status,
      featured,
      sort_order,
      architecture_diagram,
      architecture_code,
      tech_stack_description
    } = body;

    const result = await client.query(`
      INSERT INTO projects (
        name, slug, description, long_description, live_url, source_url,
        image_url, status, featured, sort_order, architecture_diagram,
        architecture_code, tech_stack_description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, name, slug, description, created_at, updated_at
    `, [
      name, slug, description, long_description || null, live_url, source_url,
      image_url || null, status || 'active', featured || false, sort_order || 0,
      architecture_diagram || null, architecture_code || null, tech_stack_description || null
    ]);

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create project'
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}