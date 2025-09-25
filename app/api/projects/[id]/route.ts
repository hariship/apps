import { NextResponse } from 'next/server';
import { getClient } from '@/lib/database';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await getClient();
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

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
      UPDATE projects SET
        name = $1, slug = $2, description = $3, long_description = $4,
        live_url = $5, source_url = $6, image_url = $7, status = $8,
        featured = $9, sort_order = $10, architecture_diagram = $11,
        architecture_code = $12, tech_stack_description = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING id, name, slug, description, updated_at
    `, [
      name, slug, description, long_description || null, live_url, source_url,
      image_url || null, status || 'active', featured || false, sort_order || 0,
      architecture_diagram || null, architecture_code || null, tech_stack_description || null,
      id
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update project'
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await getClient();
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  try {
    const result = await client.query(
      'DELETE FROM projects WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete project'
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await getClient();
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  try {
    const result = await client.query(`
      SELECT
        p.id, p.name, p.slug, p.description, p.long_description,
        p.live_url, p.source_url, p.image_url, p.status, p.featured,
        p.sort_order, p.architecture_diagram, p.architecture_code,
        p.tech_stack_description, p.created_at, p.updated_at,
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
      WHERE p.id = $1
      GROUP BY p.id, p.name, p.slug, p.description, p.long_description,
               p.live_url, p.source_url, p.image_url, p.status, p.featured,
               p.sort_order, p.architecture_diagram, p.architecture_code,
               p.tech_stack_description, p.created_at, p.updated_at
    `, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch project'
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}