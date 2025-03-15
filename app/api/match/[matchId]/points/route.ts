/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const matchId = await params.matchId;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    let points = 0;

    const userAnswers = await prismadb.answers.findMany({
      where: {
        userId,
        answered: {
          matchId,
        },
      },
      include: {
        answered: true,
      },
    });

    // Points for submitting answers
    points += userAnswers.length * 30;

    // Additional points for correct answers
    const correctAnswers = userAnswers.filter((answer) => {
      return answer.answered.answer === answer.answer;
    });
    points += correctAnswers.length * 40;

    return NextResponse.json({ points });
  } catch (error) {
    console.error("Error calculating points:", error);
    return NextResponse.json(
      { error: "Failed to calculate points" },
      { status: 500 }
    );
  }
}
