import { NextResponse } from 'next/server';
import { seedCivicPulse } from '@/lib/seed-civic-pulse';

export async function POST() {
  try {
    await seedCivicPulse();
    return NextResponse.json({
      success: true,
      message: 'Civic Pulse database seeded successfully'
    });
  } catch (error) {
    console.error('Error seeding civic pulse database:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed civic pulse database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}