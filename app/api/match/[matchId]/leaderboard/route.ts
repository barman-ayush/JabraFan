import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const matchId = (await params).matchId;

    if (!matchId) {
      return NextResponse.json(
        { error: "Match ID is required" },
        { status: 400 }
      );
    }

    const answers = await prismadb.answers.findMany({
      where: {
        answered: {
          matchId,
        },
      },
      include: {
        answeredBy: true,
        answered: true,
      },
    });

    const userPoints = answers.reduce(
      (
        acc: Record<
          string,
          {
            userId: string;
            name: string;
            points: number;
            answers: number;
            correctAnswers: number;
          }
        >,
        answer
      ) => {
        const userId = answer.userId;

        if (!acc[userId]) {
          acc[userId] = {
            userId: userId,
            name: answer.answeredBy.name || "Anonymous",
            points: 0,
            answers: 0,
            correctAnswers: 0,
          };
        }

        // Points for answering
        acc[userId].answers += 1;

        // Check for correct answer
        if (answer.answer === answer.answered.answer) {
          acc[userId].correctAnswers += 1;
        }
        return acc;
      },
      {} as Record<
        string,
        {
          userId: string;
          name: string;
          points: number;
          answers: number;
          correctAnswers: number;
        }
      >
    );

    const leaderboard = Object.values(userPoints)
      .map((user) => {
        // 30 points for answering, 40 additional points for correct answers
        const points = user.answers * 30 + user.correctAnswers * 40;
        return {
          userId: user.userId,
          name: user.name,
          points,
        };
      })
      .sort((a, b) => b.points - a.points) // Sort by points descending
      .slice(0, 10);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
