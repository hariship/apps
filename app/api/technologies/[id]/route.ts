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
      category,
      color,
      icon,
      website_url,
      active
    } = body;

    const result = await client.query(`
      UPDATE technologies SET
        name = $1, slug = $2, category = $3, color = $4,
        icon = $5, website_url = $6, active = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING id, name, slug, category, color, icon, website_url, active, updated_at
    `, [
      name, slug, category || 'tool', color || '#6B7280',
      icon || null, website_url || null, active ?? true, id
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Technology not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating technology:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update technology'
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
    // First check if technology is used in any projects
    const usageCheck = await client.query(
      'SELECT COUNT(*) as count FROM project_technologies WHERE technology_id = $1',
      [id]
    );

    if (parseInt(usageCheck.rows[0].count) > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete technology that is used in projects'
        },
        { status: 400 }
      );
    }

    const result = await client.query(
      'DELETE FROM technologies WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Technology not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Technology deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting technology:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete technology'
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
        id, name, slug, category, color, icon, website_url,
        active, created_at, updated_at
      FROM technologies
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Technology not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching technology:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch technology'
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}