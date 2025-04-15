/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// IPL team name mapping to help with search
const IPL_TEAMS: Record<string, string> = {
    'csk': 'Chennai Super Kings',
    'chennai': 'Chennai Super Kings',
    'mi': 'Mumbai Indians',
    'mumbai': 'Mumbai Indians',
    'rcb': 'Royal Challengers Bangalore',
    'bangalore': 'Royal Challengers Bangalore',
    'srh': 'Sunrisers Hyderabad',
    'hyderabad': 'Sunrisers Hyderabad',
    'dc': 'Delhi Capitals',
    'delhi': 'Delhi Capitals',
    'kkr': 'Kolkata Knight Riders',
    'kolkata': 'Kolkata Knight Riders',
    'pbks': 'Punjab Kings',
    'punjab': 'Punjab Kings',
    'rr': 'Rajasthan Royals',
    'rajasthan': 'Rajasthan Royals',
    'gt': 'Gujarat Titans',
    'gujarat': 'Gujarat Titans',
    'lsg': 'Lucknow Super Giants',
    'lucknow': 'Lucknow Super Giants'
};

// Match result type
type MatchResult = {
    success: boolean;
    match?: {
        id: string;
        name: string;
        status: string;
        date: string;
        venue: string;
        teams: {
            team1: {
                name: string;
                score: string;
            };
            team2: {
                name: string;
                score: string;
            };
        }
    };
    error?: string;
};

// Normalize team names for better matching
const getNormalizedTeamName = (input: string): string | null => {
    if (!input) return null;

    const normalizedInput = input.toLowerCase().trim();

    // Direct match in our mapping
    if (IPL_TEAMS[normalizedInput]) {
        return IPL_TEAMS[normalizedInput];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(IPL_TEAMS)) {
        if (value.toLowerCase().includes(normalizedInput) ||
            normalizedInput.includes(key)) {
            return value;
        }
    }

    return null;
};

// Function to get match data from CricAPI
async function getCricketAPIData(team1: string, team2: string, date?: string): Promise<MatchResult> {
    try {
        // CricAPI - get your free API key from https://cricapi.com/
        const API_KEY = process.env.CRICKET_API_KEY;

        if (!API_KEY) {
            return {
                success: false,
                error: "API key not configured. Please set CRICKET_API_KEY environment variable."
            };
        }

        const API_URL = "https://api.cricapi.com/v1";

        // Normalize team names
        const normalizedTeam1 = getNormalizedTeamName(team1);
        const normalizedTeam2 = getNormalizedTeamName(team2);

        if (!normalizedTeam1 || !normalizedTeam2) {
            return {
                success: false,
                error: "Invalid team name(s). Please provide valid IPL team names."
            };
        }

        // Step 1: Check current matches first (ongoing matches)
        const currentMatchesResponse = await axios.get(`${API_URL}/currentMatches`, {
            params: {
                apikey: API_KEY,
                offset: 0,
                search: "IPL" // Focus on IPL matches
            }
        });

        let targetMatch = null;

        // Check if there are any current matches
        if (currentMatchesResponse.data.data) {
            // Look for a match between our teams
            targetMatch = currentMatchesResponse.data.data.find((match: any) => {
                // Get the team names from match data
                const teams = match.teams || [];
                const teamInfoNames = (match.teamInfo || []).map((t: any) => t.name);

                // Check if both our teams are playing in this match
                const isTeam1Match =
                    teams.includes(normalizedTeam1) ||
                    teams.some((t: string) => t.includes(normalizedTeam1)) ||
                    teamInfoNames.includes(normalizedTeam1) ||
                    teamInfoNames.some((t: string) => t.includes(normalizedTeam1));

                const isTeam2Match =
                    teams.includes(normalizedTeam2) ||
                    teams.some((t: string) => t.includes(normalizedTeam2)) ||
                    teamInfoNames.includes(normalizedTeam2) ||
                    teamInfoNames.some((t: string) => t.includes(normalizedTeam2));

                // Check date if provided
                const isDateMatch = !date || match.date.includes(date);

                return isTeam1Match && isTeam2Match && isDateMatch;
            });
        }

        // Step 2: If not found in current matches, try scheduled/completed matches
        if (!targetMatch) {
            // Using the matches endpoint with date filter if provided
            const matchesParams: any = {
                apikey: API_KEY,
                offset: 0,
                search: "IPL"
            };

            if (date) {
                matchesParams.date = date;
            }

            const matchesResponse = await axios.get(`${API_URL}/matches`, {
                params: matchesParams
            });

            if (matchesResponse.data.data) {
                targetMatch = matchesResponse.data.data.find((match: any) => {
                    // Similar logic as above
                    const teams = match.teams || [];
                    const teamInfoNames = (match.teamInfo || []).map((t: any) => t.name);

                    const isTeam1Match =
                        teams.includes(normalizedTeam1) ||
                        teams.some((t: string) => t.includes(normalizedTeam1)) ||
                        teamInfoNames.includes(normalizedTeam1) ||
                        teamInfoNames.some((t: string) => t.includes(normalizedTeam1));

                    const isTeam2Match =
                        teams.includes(normalizedTeam2) ||
                        teams.some((t: string) => t.includes(normalizedTeam2)) ||
                        teamInfoNames.includes(normalizedTeam2) ||
                        teamInfoNames.some((t: string) => t.includes(normalizedTeam2));

                    return isTeam1Match && isTeam2Match;
                });
            }
        }

        // If no match found between these teams
        if (!targetMatch) {
            return {
                success: false,
                error: `No IPL match found between ${normalizedTeam1} and ${normalizedTeam2}${date ? ` on ${date}` : ''}`
            };
        }

        // Step 3: Get detailed match information
        const matchDetailResponse = await axios.get(`${API_URL}/match_info`, {
            params: {
                apikey: API_KEY,
                id: targetMatch.id
            }
        });

        const matchDetail = matchDetailResponse.data.data || targetMatch;

        // Extract team information
        const teamInfo = matchDetail.teamInfo || [];
        const team1Info = teamInfo[0] || { name: normalizedTeam1 };
        const team2Info = teamInfo[1] || { name: normalizedTeam2 };

        const team1Name = team1Info.name;
        const team2Name = team2Info.name;

        // Format the scores
        const scoreData = matchDetail.score || [];

        // Find score for each team
        const team1Score = scoreData.find((s: any) =>
            s.inning.includes(team1Name) || (team1Name.includes(s.inning.split(" ")[0]))
        );

        const team2Score = scoreData.find((s: any) =>
            s.inning.includes(team2Name) || (team2Name.includes(s.inning.split(" ")[0]))
        );

        return {
            success: true,
            match: {
                id: matchDetail.id,
                name: matchDetail.name || `${team1Name} vs ${team2Name}`,
                status: matchDetail.status,
                date: matchDetail.date,
                venue: matchDetail.venue,
                teams: {
                    team1: {
                        name: team1Name,
                        score: team1Score ? `${team1Score.r}/${team1Score.w} (${team1Score.o} ov)` : 'Yet to bat'
                    },
                    team2: {
                        name: team2Name,
                        score: team2Score ? `${team2Score.r}/${team2Score.w} (${team2Score.o} ov)` : 'Yet to bat'
                    }
                }
            }
        };

    } catch (error) {
        console.error("API Error:", error);
        return {
            success: false,
            error: "Failed to fetch match data from CricAPI"
        };
    }
}

// GET handler for App Router
export async function GET(request: NextRequest) {
    try {
        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const team1 = searchParams.get('team1');
        const team2 = searchParams.get('team2');
        const date = searchParams.get('date') || undefined;

        // Validate required parameters
        if (!team1 || !team2) {
            return NextResponse.json(
                { success: false, message: 'Both team1 and team2 parameters are required' },
                { status: 400 }
            );
        }

        // Get match data from CricAPI
        const result = await getCricketAPIData(team1, team2, date || undefined);

        // Return appropriate response based on result
        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json(result, { status: 404 });
        }

    } catch (error) {
        console.error('Error processing request:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch match data',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}