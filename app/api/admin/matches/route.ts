import { Match } from "@/utils/types";
import { NextResponse, NextRequest } from "next/server";
import prismadb from "@/lib/prismadb";

export type MatchResponse = {
  data: {
    sport_events: Array<{
      tournament: {
        name: string;
      };
      id: string;
      season: {
        name: string;
      };
      scheduled: string;
      competitors: Array<{
        name: string;
        abbreviation: string;
      }>;
    }>;
  };
};

export async function GET() {
  try {
    // First, check for matches in the database
    const dbMatches = await prismadb.matches.findMany({
      include: {
        questions: true,
      },
    });
    
    // Always fetch from external service to get the latest matches
    const response = await fetch(
      `${process.env.AI_SERVICE_URL}/daily-live-schedule`
    );

    const data: MatchResponse = await response.json();
    const res = data.data.sport_events;
    const backendMatches: Match[] = [];
    
    // Process backend matches
    res.forEach((element) => {
      const obj = {
        id: element.id,
        team1: element.competitors[0].name,
        team2: element.competitors[1].name,
        date: element.scheduled,
        time: element.scheduled,
        league: element.tournament.name,
        questions: [],
      };
      backendMatches.push(obj);
    });
    
    // Create a map of existing db matches by team names for easy lookup
    const dbMatchMap = new Map();
    dbMatches.forEach(match => {
      const key = `${match.team1}-${match.team2}`;
      dbMatchMap.set(key, match);
    });
    
    // Merge matches: prioritize DB matches when they exist
    const mergedMatches = backendMatches.map(match => {
      const key = `${match.team1}-${match.team2}`;
      return dbMatchMap.has(key) ? dbMatchMap.get(key) : match;
    });
    
    return NextResponse.json(mergedMatches);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const match = body.match;

    await prismadb.matches.create({
      data: {
        team1: match.team1,
        team2: match.team2,
        date: match.date,
        league: match.league,
        questions: {
          create: match.questions,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}