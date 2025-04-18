/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const { questionId, answer, userId } = await request.json();

    // Basic validation
    if (!questionId || !answer || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user has already answered this question
    const existingAnswer = await prismadb.answers.findFirst({
      where: {
        questionId,
        userId
      }
    });


    // If answer already exists, return an error
    if (existingAnswer) {
      return NextResponse.json(
        { success: false, error: "You have already answered this question" },
        { status: 409 } // 409 Conflict
      );
    }

    
    // Save Answer to database (only if no existing answer found)
    await prismadb.answers.create({
      data: {
        questionId,
        answer,
        userId,
      },
    });

    // Update the User's credits
    const userData = await prismadb.user.findUnique({ where: { id: userId } });
    const newCredits: number | undefined = userData!.credits + parseInt(process.env.ANSWER_QUESTION_CREDITS_AWARD!);
    const updatedUserData = await prismadb.user.update({ where: { id: userId }, data: { credits: newCredits } });

    return NextResponse.json({ success: true , updatedUserData }, { status: 200 });
  } catch (error) {
    console.error("Error saving answer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save answer" },
      { status: 500 }
    );
  }
}


export async function GET(request: Request) {
  try {
    // Get query parameters from the URL
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const questionId = url.searchParams.get('questionId');

    if (!userId || !questionId) {
      return NextResponse.json(
        { success: false, error: "Missing Fields" },
        { status: 400 }
      );
    }

    const answer = await prismadb.answers.findFirst({
      where: {
        userId: userId,
        questionId: questionId
      }
    });

    // console.log("[ ANSWER ]", answer);

    return NextResponse.json(
      { success: true, answer: answer },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving answer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve answer" },
      { status: 500 }
    );
  }
}