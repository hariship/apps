import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real app, this would come from database/config
    const metadata = {
      title: "Apps Dashboard - Portfolio Projects",
      description: "Portfolio dashboard showcasing development projects with architecture diagrams and technology stacks",
      keywords: ["portfolio", "projects", "developer", "dashboard", "next.js", "react"],
      brandName: "Apps Dashboard",
      tagline: "APPS DASHBOARD"
    };

    return NextResponse.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch metadata'
      },
      { status: 500 }
    );
  }
}