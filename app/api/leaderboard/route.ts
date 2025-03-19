/* eslint-disable @typescript-eslint/no-explicit-any */
import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest
) {
    try {
        // Fetch all users ordered by credits in descending order
        const allUsers = await prismadb.user.findMany({
            select: {
                id: true,
                name: true,
                credits: true,
            },
            orderBy: {
                credits: 'desc'
            }
        });

        // Get only the top three users
        const topThreeUsers = allUsers.slice(0, 3);

        return NextResponse.json({
            success: true, 
            message: "Top users fetched successfully!",
            data: topThreeUsers
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("Error fetching top users:", errorMessage);

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}