/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const { questionId } = await req.json();
        if (!questionId) return NextResponse.json(
            { success: false, error: "Question Id not sent" },
            { status: 500 }
        );
        const updatedQues = await prismadb.questions.update({ where: { id: questionId }, data: { isActive: false } });
        console.log(updatedQues);
        return NextResponse.json(
            { success: true, data: updatedQues },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating answer:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update answer" },
            { status: 500 }
        );
    }
}