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
      url,
      icon,
      status,
      version
    } = body;

    const result = await client.query(`
      UPDATE integrations SET
        name = $1, slug = $2, description = $3, url = $4,
        icon = $5, status = $6, version = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING id, name, slug, description, url, icon, status, version, updated_at
    `, [
      name, slug, description, url, icon || null,
      status || 'operational', version || null, id
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Integration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating integration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update integration'
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
      'DELETE FROM integrations WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Integration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Integration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting integration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete integration'
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
        id, name, slug, description, url, icon, status, version,
        last_checked, enabled, sort_order, created_at, updated_at
      FROM integrations
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Integration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching integration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch integration'
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}