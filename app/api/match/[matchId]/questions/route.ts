/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
    request: NextRequest,
    { params }: { params: { matchId: string } }
) {
    try {
        const matchId = (await params).matchId;

        const questions = await prismadb.questions.findMany({
            where: {
                matchId,
            },
        });

        return NextResponse.json(questions, { status: 200 });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json(
            { error: "Failed to fetch questions" },
            { status: 500 }
        );
    }
}