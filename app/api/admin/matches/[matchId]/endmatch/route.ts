import prismadb from "@/lib/prismadb";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { matchId: string } }
) {
    try {
        const matchId = (await params).matchId;
        const updatedMatch = await prismadb.matches.update({
            where: { id: matchId },
            data: {
                isCompleted: true
            }
        })
        if (!updatedMatch) return NextResponse.json({ error: "Cannot Update Match" }, { status: 404 });
        console.log("[ UPDATED_MATCH ]", updatedMatch);
        return NextResponse.json({ success: true, message: "Updated successfully", data: updatedMatch });
    } catch (e) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("Error creating match:", errorMessage);

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );

    }
}