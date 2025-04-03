/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { team1, team2, date } = await request.json();

        if (!team1 || !team2) {
            return NextResponse.json(
                { success: false, error: "Team names are required" },
                { status: 400 }
            );
        }

        // You can replace this with an actual cricket API call
        // Some options include:
        // - CricAPI (https://www.cricapi.com/)
        // - Cricket Data API (https://cricketdata.org/)
        // - Sports API (https://sportsapi.io/)

        try {
            // Replace the URL with your actual cricket API endpoint
            // This is just an example structure
            const apiKey = process.env.CRICKET_API_KEY;
            const response = await fetch(`https://api.cricket-data.org/v1/matches?apikey=${apiKey}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch from cricket API');
            }

            const matchData = await response.json();

            // Find the match that corresponds to our teams
            // This filtering logic will depend on the API you're using
            const match = matchData.matches?.find((m: any) =>
                (m.team1Name?.includes(team1) || m.team1Name?.includes(team2)) &&
                (m.team2Name?.includes(team1) || m.team2Name?.includes(team2))
            );

            if (match) {
                return NextResponse.json({
                    success: true,
                    team1Score: match.team1Score || "Yet to bat",
                    team2Score: match.team2Score || "Yet to bat",
                    status: match.status || "Match in progress",
                    isLive: match.matchStatus === "LIVE",
                });
            }

            // For demonstration, return mock data if no match is found in the API
            return getMockLiveScoreResponse(team1, team2);

        } catch (apiError) {
            console.error('Error with cricket API:', apiError);

            // Fallback to mock data for demonstration
            return getMockLiveScoreResponse(team1, team2);
        }

    } catch (error) {
        console.error('Error processing live score request:', error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch live scores" },
            { status: 500 }
        );
    }
}

function getMockLiveScoreResponse(team1: string, team2: string) {
    // Generate realistic mock data based on team names
    const now = new Date();
    const isMatchLive = Math.random() > 0.3; // 70% chance match is live

    // Generate random scores
    const team1Wickets = Math.floor(Math.random() * 10);
    const team1Runs = Math.floor(Math.random() * 220) + 50;
    const team1Overs = Math.min(20, Math.floor(Math.random() * 20) + (Math.random() * 0.5));

    const team2Wickets = Math.floor(Math.random() * 10);
    const team2Runs = Math.floor(Math.random() * 220) + 50;
    const team2Overs = Math.min(20, Math.floor(Math.random() * 20) + (Math.random() * 0.5));

    const hasTeam1Batted = isMatchLive ? true : Math.random() > 0.5;
    const hasTeam2Batted = isMatchLive ? Math.random() > 0.5 : false;

    // Create formatted scores
    const team1Score = hasTeam1Batted
        ? `${team1Runs}/${team1Wickets} (${team1Overs.toFixed(1)} ov)`
        : "Yet to bat";

    const team2Score = hasTeam2Batted
        ? `${team2Runs}/${team2Wickets} (${team2Overs.toFixed(1)} ov)`
        : "Yet to bat";

    // Generate status message
    let status;
    if (isMatchLive) {
        if (hasTeam1Batted && !hasTeam2Batted) {
            status = `${team1} batting first`;
        } else if (hasTeam1Batted && hasTeam2Batted) {
            const runsNeeded = team1Runs - team2Runs;
            if (runsNeeded > 0) {
                status = `${team2} need ${runsNeeded} runs to win`;
            } else {
                status = `${team2} won by ${team2Wickets} wickets`;
            }
        }
    } else {
        status = "Match updates will appear here";
    }

    return NextResponse.json({
        success: true,
        team1Score,
        team2Score,
        status,
        isLive: isMatchLive,
    });
}