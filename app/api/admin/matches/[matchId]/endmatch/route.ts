/* eslint-disable @typescript-eslint/no-explicit-any */
import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: any }
) {
    try {
        const matchId = params.matchId;
        
        // Mark match as completed
        const updatedMatch = await prismadb.matches.update({
            where: { id: matchId },
            data: {
                isCompleted: true
            }
        });
        
        if (!updatedMatch) {
            return NextResponse.json({ error: "Cannot Update Match" }, { status: 404 });
        }
        
        // Get prize money amounts from environment variables
        const firstPrize = process.env.FIRST_PRIZE ? parseInt(process.env.FIRST_PRIZE) : 500;
        const secondPrize = process.env.SECOND_PRIZE ? parseInt(process.env.SECOND_PRIZE) : 300;
        const thirdPrize = process.env.THIRD_PRIZE ? parseInt(process.env.THIRD_PRIZE) : 200;
        
        // Find all user answers for this match
        const matchAnswers = await prismadb.answers.findMany({
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
        
        // Calculate points for each user (30 per answer + 40 per correct answer)
        const userPoints = matchAnswers.reduce((acc : any, answer) => {
            const userId = answer.userId;
            
            if (!acc[userId]) {
                acc[userId] = {
                    userId,
                    points: 0
                };
            }
            
            // Base points for answering
            acc[userId].points += 30;
            
            // Bonus points for correct answers
            if (answer.answer === answer.answered.answer) {
                acc[userId].points += 40;
            }
            
            return acc;
        }, {});
        
        // Convert to array and sort by points to get top 3
        const topUsers : any = Object.values(userPoints)
            .sort((a : any, b : any) => b.points - a.points)
            .slice(0, 3);
        
        // Check if we have winners
        if (topUsers.length > 0) {
            // Prepare prize amounts for each position
            const prizes = [
                { position: 0, amount: firstPrize },
                { position: 1, amount: secondPrize },
                { position: 2, amount: thirdPrize }
            ];
            
            // Update winnings for top 3 users (or fewer if not enough participants)
            for (let i = 0; i < Math.min(topUsers.length, 3); i++) {
                await prismadb.user.update({
                    where: {
                        id: topUsers[i].userId
                    },
                    data: {
                        winnings: {
                            increment: prizes[i].amount
                        }
                    }
                });
                
                console.log(`Awarded ₹${prizes[i].amount} to user ${topUsers[i].userId} for position ${i+1}`);
            }
        }
        
        return NextResponse.json({
            success: true,
            message: "Match completed and prizes awarded",
            data: {
                match: updatedMatch,
                topUsers: topUsers.map((user : any, index : any) => ({
                    userId: user.userId,
                    position: index + 1,
                    points: user.points,
                    prize: index === 0 ? firstPrize : index === 1 ? secondPrize : index === 2 ? thirdPrize : 0
                }))
            }
        });
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("Error completing match:", errorMessage);

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}