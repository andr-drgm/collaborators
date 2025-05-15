import { NextResponse } from 'next/server';

const GITHUB_OWNER = "kms77";
const GITHUB_REPO = "solana-final-project";

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits`,
            {
                headers: {
                    'Authorization': authHeader,
                    'Accept': 'application/vnd.github.v3+json',
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, error: errorData.message },
                { status: response.status }
            );
        }

        const commits = await response.json();
        const totalCommits = commits.length;
        const reportData = computeReportData(commits);
        const tokens = totalCommits * 0.1;

        return NextResponse.json({
            success: true,
            report_data: reportData,
            total_commits: totalCommits,
            tokens: tokens
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch GitHub data' },
            { status: 500 }
        );
    }
}

// TypeScript implementation of PHP computeReportData
function computeReportData(commits: any[]): { [key: string]: number } {
    const reportData: { [key: string]: number } = {};
    const currentDate = new Date();
    const previousYear = new Date();
    previousYear.setFullYear(currentDate.getFullYear() - 1);

    // Initialize date range with 0 commits
    const dateRange: { [key: string]: number } = {};
    const dateCursor = new Date(previousYear);
    
    while (dateCursor <= currentDate) {
        const formattedDate = dateCursor.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
        dateRange[formattedDate] = 0;
        dateCursor.setDate(dateCursor.getDate() + 1);
    }

    // Process commits
    for (const commit of commits) {
        const commitDate = new Date(commit.commit.author.date);
        const formattedCommitDate = commitDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');

        if (dateRange.hasOwnProperty(formattedCommitDate)) {
            dateRange[formattedCommitDate]++;
        }
    }

    return dateRange;
}