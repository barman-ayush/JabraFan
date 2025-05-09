import { IPLMemory } from "@/lib/memory";
import prismadb from "@/lib/prismadb";
import redis from "@/lib/redis";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const dateParam = url.searchParams.get("date");
        // dateParam Check
        if (!dateParam) {
            return NextResponse.json({ error: "Missing 'date' query parameter." }, { status: 400 });
        }
        // Format Validation
        const match = dateParam.match(/^(\d{2})\/(\d{2})\/(\d{2})\/([0-3])$/);
        if (!match) {
            return NextResponse.json({ error: "Invalid 'date' format. Expected YY/MM/DD/L." }, { status: 400 });
        }
        const [_, yy, mm, dd, dataType] = match;
        // Check Cache
        const uniqueKey = `${yy}${mm}${dd}${dataType}`;
        let headlines = await redis.get(uniqueKey);
        if (headlines) {
            console.log("Cache Hit");
            const jsonData = await JSON.parse(headlines);
            return NextResponse.json({ headlines: jsonData })
        }
        // Check DB 
        console.log("Cache Miss");
        const savedData = await prismadb.dugoutData.findUnique({ where: { uniqueKey: uniqueKey } });
        if (!savedData) {
            // Not present 
            return NextResponse.json({ success: false, message: "No Headlines Available for today !!" });
        }
        // Present , so cache it
        const jsonString = await JSON.stringify(savedData.jsonData);
        await redis.set(uniqueKey, jsonString);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("Error fetching top users:", errorMessage);

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}