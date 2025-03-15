/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const matchId = params.matchId;
    
    // Get user ID from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!matchId || !userId) {
      return NextResponse.json(
        { error: "Match ID and User ID are required" },
        { status: 400 }
      );
    }

    // Get all questions for this match
    const match = await prismadb.matches.findUnique({
      where: { id: matchId },
      include: { questions: true }
    });

    if (!match) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      );
    }

    // Get user's answers for this match
    const userAnswers = await prismadb.answers.findMany({
      where: {
        userId: userId,
        answered: {
          matchId: matchId
        }
      },
      include: {
        answered: true
      }
    });

    // Calculate statistics
    const totalQuestions = match.questions.length;
    const answeredQuestions = userAnswers.length;
    const correctAnswers = userAnswers.filter(answer => 
      answer.answer === answer.answered.answer
    ).length;

    // Calculate credits (30 per answer, 40 additional for correct)
    const baseCredits = answeredQuestions * 30;
    const bonusCredits = correctAnswers * 40;
    const totalCredits = baseCredits + bonusCredits;

    // Get user's rank in leaderboard
    const leaderboard = await prismadb.answers.findMany({
      where: {
        answered: {
          matchId: matchId
        }
      },
      include: {
        answeredBy: true,
        answered: true
      }
    });

    // Calculate points for each user
    const userPoints = leaderboard.reduce(
      (acc: Record<string, { userId: string; name: string; points: number }>, answer) => {
        const answerUserId = answer.userId;

        if (!acc[answerUserId]) {
          acc[answerUserId] = {
            userId: answerUserId,
            name: answer.answeredBy.name || "Anonymous",
            points: 0
          };
        }

        // Add points for answering (30 points)
        acc[answerUserId].points += 30;

        // Add bonus points for correct answers (40 points)
        if (answer.answer === answer.answered.answer) {
          acc[answerUserId].points += 40;
        }

        return acc;
      },
      {}
    );

    // Convert to array and sort by points
    const sortedLeaderboard = Object.values(userPoints)
      .sort((a, b) => b.points - a.points);

    // Find user's position in the leaderboard
    const userRank = sortedLeaderboard.findIndex(entry => entry.userId === userId) + 1;

    // Get prize money from environment variables
    const firstPrize = process.env.FIRST_PRIZE ? parseInt(process.env.FIRST_PRIZE) : 500;
    const secondPrize = process.env.SECOND_PRIZE ? parseInt(process.env.SECOND_PRIZE) : 300;
    const thirdPrize = process.env.THIRD_PRIZE ? parseInt(process.env.THIRD_PRIZE) : 200;

    // Calculate potential prize money
    let potentialPrize = 0;
    if (userRank === 1) potentialPrize = firstPrize;
    else if (userRank === 2) potentialPrize = secondPrize;
    else if (userRank === 3) potentialPrize = thirdPrize;

    return NextResponse.json({
      success: true,
      data: {
        totalQuestions,
        answeredQuestions,
        correctAnswers,
        baseCredits,
        bonusCredits,
        totalCredits,
        userRank,
        potentialPrize,
        prizeInfo: {
          firstPrize,
          secondPrize,
          thirdPrize
        }
      }
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
}