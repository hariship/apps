import { NextResponse } from 'next/server';
import { getClient } from '@/lib/database';

export async function GET() {
  const client = await getClient();

  try {
    const result = await client.query(`
      SELECT
        id, name, slug, description, url, icon, status, version,
        last_checked, enabled, sort_order, created_at, updated_at
      FROM integrations
      ORDER BY sort_order ASC, name ASC
    `);

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch integrations'
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
      url,
      icon,
      status,
      version
    } = body;

    const result = await client.query(`
      INSERT INTO integrations (
        name, slug, description, url, icon, status, version, enabled
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, slug, description, url, icon, status, version, created_at, updated_at
    `, [
      name, slug, description, url, icon || null,
      status || 'operational', version || null, true
    ]);

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating integration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create integration'
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}