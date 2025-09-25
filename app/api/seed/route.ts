import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  try {
    // Only allow seeding in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error: 'Seeding is not allowed in production'
        },
        { status: 403 }
      );
    }

    await seedDatabase();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully'
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}