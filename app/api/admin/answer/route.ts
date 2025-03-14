import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const { questionId, answer } = await req.json();

        // Save the answer to the question
        await prismadb.questions.update({
            where: {
                id: questionId,
            },
            data: {
                status: "answered",
                answer,
            },
        });

        // Find all user answers for this question that match the correct answer
        const correctUserAnswers = await prismadb.answers.findMany({
            where: {
                questionId: questionId,
                answer: answer // Only get answers that match the correct answer
            },
            include: {
                answeredBy: true // Include user information
            }
        });

        // Update credits for all users with correct answers
        if (correctUserAnswers.length > 0) {
            // Use a transaction to ensure all updates complete successfully
            await prismadb.$transaction(
                correctUserAnswers.map(userAnswer =>
                    prismadb.user.update({
                        where: {
                            id: userAnswer.userId
                        },
                        data: {
                            credits: {
                                increment: 40 // Add 40 credits for a correct answer
                            }
                        }
                    })
                )
            );

            console.log(`Rewarded ${correctUserAnswers.length} users with 40 credits for correct answers`);
        }

        return NextResponse.json({
            success: true,
            message: "Answer updated and credits distributed",
            correctAnswersCount: correctUserAnswers.length
        });
    } catch (error) {
        console.error("Error updating answer:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update answer" },
            { status: 500 }
        );
    }
}