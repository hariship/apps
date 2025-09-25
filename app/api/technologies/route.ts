import { NextResponse } from 'next/server';
import { getClient } from '@/lib/database';

export async function GET() {
  const client = await getClient();

  try {
    const result = await client.query(`
      SELECT
        id, name, slug, category, color, icon, website_url,
        active, created_at, updated_at
      FROM technologies
      ORDER BY category ASC, name ASC
    `);

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch technologies'
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
      category,
      color,
      icon,
      website_url,
      active
    } = body;

    const result = await client.query(`
      INSERT INTO technologies (
        name, slug, category, color, icon, website_url, active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, slug, category, color, icon, website_url, active, created_at, updated_at
    `, [
      name, slug, category || 'tool', color || '#6B7280',
      icon || null, website_url || null, active ?? true
    ]);

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating technology:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create technology'
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}