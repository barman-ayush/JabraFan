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

    // Save to database
    await prismadb.answers.create({
      data: {
        questionId,
        answer,
        userId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error saving answer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save answer" },
      { status: 500 }
    );
  }
}
