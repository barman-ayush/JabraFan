/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
    request: NextRequest,
    { params }: { params: any }
){
    try{
        const matchId = params.matchId;
        const body = await request.json();
        
        // Extract the questions array from the request body
        const { questions } = body;
        
        if (!Array.isArray(questions) || questions.length === 0) {
            return NextResponse.json(
                { error: "Questions array is required and must not be empty" },
                { status: 400 }
            );
        }
        
        // MAKE A CHECK HERE THAT WHETHER THE MATCH IS LIVE OR NOT 
        const match = await prisma.matches.findUnique({
            where: { id: matchId }
        });
        
        if (!match) {
            return NextResponse.json(
                { error: "Match not found" },
                { status: 404 }
            );
        }

        console.log(" [ QUESTIONS ] : " , questions);
        
        // Create all questions in a single transaction
        const createdQuestions = await prisma.$transaction(
            questions.map(question => 
                prisma.questions.create({
                    data: {
                        text: question.question,
                        status: question.status || "PENDING", // Default status if not provided
                        matchId: matchId // Set the foreign key to connect to the match
                    }
                })
            )
        );
        
        return NextResponse.json({
            success: true,
            message: `${createdQuestions.length} questions added successfully`,
            data: createdQuestions
        });

    } catch (error) {
      // Fix error handling
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("Error creating match:", errorMessage);
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
}