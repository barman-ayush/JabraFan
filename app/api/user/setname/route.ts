// app/api/user/setname/route.ts
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, name } = body;

        if (!userId || !name) {
            return NextResponse.json({ error: "User ID and Name is required" }, { status: 400 });
        }
        const updatedUser = await prismadb.user.update({
            where: {
                id: userId
            },
            data: {
                name: name
            }
        });
        return NextResponse.json({ userData : updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user transactions:", error);
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}