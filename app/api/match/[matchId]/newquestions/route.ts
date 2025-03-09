import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = await params.matchId;
    const noOfQuestions = searchParams.get("noOfQuestions") || "5";

    const response = await fetch(
      `${process.env.AI_SERVICE_URL}/generate-contest?match_id=${matchId}&no_of_questions=${noOfQuestions}`
    );

    const data = await response.json();

    const questions = data.map((question: string) => {
      return {
        question,
      };
    });

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const matchId = await params.matchId;
    const body = await request.json();
    const questions = body.questions;

    // Save to database
    for (const question of questions) {
      await prismadb.questions.create({
        data: {
          matchId,
          text: question.text,
          status: "unanswered",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
