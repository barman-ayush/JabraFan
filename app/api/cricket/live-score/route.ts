/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { team1, team2, date } = await request.json();
        console.log(team1 , team2 , date);
        // return;

        if (!team1 || !team2 || !date) {
            return NextResponse.json(
                { success: false, error: "Team names and date are required" },
                { status: 400 }
            );
        }

        try {
            const apiKey = process.env.CRICKET_API_KEY;
            const response = await fetch(`https://api.sportmonks.com/v3/cricket/fixtures?api_token=${apiKey}&filter[date]=${date}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            console.log(response)

            if (!response.ok) {
                throw new Error('Failed to fetch from cricket API');
            }

            const matchData = await response.json();

            const match = matchData.data?.find((m: any) =>
                (m.localteam.name.includes(team1) || m.localteam.name.includes(team2)) &&
                (m.visitorteam.name.includes(team1) || m.visitorteam.name.includes(team2))
            );

            if (match) {
                return NextResponse.json({
                    success: true,
                    team1Score: match.runs[0]?.score || "Yet to bat",
                    team2Score: match.runs[1]?.score || "Yet to bat",
                    status: match.status || "Match in progress",
                    isLive: match.live,
                });
            }

            return getMockLiveScoreResponse(team1, team2);
        } catch (apiError) {
            console.error('Error with cricket API:', apiError);
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
    const isMatchLive = Math.random() > 0.3;
    const team1Runs = Math.floor(Math.random() * 220) + 50;
    const team1Wickets = Math.floor(Math.random() * 10);
    const team1Overs = Math.min(20, Math.floor(Math.random() * 20) + (Math.random() * 0.5));
    const team2Runs = Math.floor(Math.random() * 220) + 50;
    const team2Wickets = Math.floor(Math.random() * 10);
    const team2Overs = Math.min(20, Math.floor(Math.random() * 20) + (Math.random() * 0.5));

    const hasTeam1Batted = isMatchLive ? true : Math.random() > 0.5;
    const hasTeam2Batted = isMatchLive ? Math.random() > 0.5 : false;

    const team1Score = hasTeam1Batted ? `${team1Runs}/${team1Wickets} (${team1Overs.toFixed(1)} ov)` : "Yet to bat";
    const team2Score = hasTeam2Batted ? `${team2Runs}/${team2Wickets} (${team2Overs.toFixed(1)} ov)` : "Yet to bat";

    let status;
    if (isMatchLive) {
        if (hasTeam1Batted && !hasTeam2Batted) {
            status = `${team1} batting first`;
        } else if (hasTeam1Batted && hasTeam2Batted) {
            const runsNeeded = team1Runs - team2Runs;
            status = runsNeeded > 0 ? `${team2} need ${runsNeeded} runs to win` : `${team2} won by ${team2Wickets} wickets`;
        }
    } else {
        status = "Match updates will appear here";
    }

    return NextResponse.json({ success: true, team1Score, team2Score, status, isLive: isMatchLive });
}
