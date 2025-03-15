/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const matchId = (await params).matchId;

    const match = await prismadb.matches.findUnique({
      where: { id: matchId },
      include: { questions: true },
    });

    return NextResponse.json(match);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, params: { matchId: string }) {
  try {
    const body = await request.json();
    const { team1, team2, league, date } = body;

    if (!team1 || !team2 || !league || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const match = await prismadb.matches.create({
      data: {
        id: params.matchId,
        team1,
        team2,
        league,
        date,
      },
    });

    return NextResponse.json(match);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
