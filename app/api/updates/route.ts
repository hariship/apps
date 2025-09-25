import { NextResponse } from 'next/server';
import { getClient } from '@/lib/database';

export async function GET(request: Request) {
  const client = await getClient();
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');

  try {
    let query = `
      SELECT
        u.id, u.project_id, u.title, u.content, u.version,
        u.update_type, u.published, u.created_at, u.updated_at,
        p.name as project_name, p.slug as project_slug
      FROM updates u
      LEFT JOIN projects p ON u.project_id = p.id
      WHERE u.published = true
    `;

    const params: any[] = [];

    if (projectId) {
      query += ' AND u.project_id = $1';
      params.push(projectId);
    }

    query += ' ORDER BY u.created_at DESC';

    const result = await client.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch updates'
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}