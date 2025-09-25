import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get('repo') || 'hariship/apps';
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  try {
    // Fetch latest commits from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${repo}/commits?per_page=${limit}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Add token if you have one for higher rate limits
          // 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        },
        next: { revalidate: 60 } // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch commits');
    }

    const commits = await response.json();

    // Format commits for our UI
    const formattedCommits = commits.map((commit: any) => ({
      id: commit.sha,
      title: commit.commit.message.split('\n')[0], // First line of commit message
      content: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url,
      sha: commit.sha.substring(0, 7) // Short SHA
    }));

    return NextResponse.json({
      success: true,
      data: formattedCommits
    });
  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch commits from GitHub'
      },
      { status: 500 }
    );
  }
}