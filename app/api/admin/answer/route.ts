import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const { questionId, answer } = await req.json();
        
        // Save to database
        await prismadb.questions.update({
            where: {
                id: questionId,
            },
            data: {
                answer,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating answer:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update answer" },
            { status: 500 }
        );
    }
}