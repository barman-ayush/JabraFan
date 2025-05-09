import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis"; // Assuming you have Redis for caching
import { format, startOfWeek, endOfWeek, parseISO } from "date-fns";
import prismadb from "@/lib/prismadb";

export async function GET(req: NextRequest) {
  try {
    // Get date query parameter (expecting YYYY-MM-DD format)
    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");
    
    if (!dateParam) {
      return NextResponse.json(
        { success: false, message: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Parse the date and get the week start (Monday) and end (Sunday)
    const date = parseISO(dateParam);
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    
    // Create a unique key for caching based on the week start date
    // Use ISO week number and year for a consistent key format
    const weekKey = format(weekStart, "'week'_I_yyyy"); // e.g., 'week_18_2025'
    
    // Prepare the week range info for the response
    const weekRange = {
      start: format(weekStart, "yyyy-MM-dd"),
      end: format(weekEnd, "yyyy-MM-dd"),
      displayRange: `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`
    };
    
    // Try to get data from cache first
    const cachedData = await redis.get(weekKey);
    if (cachedData) {
      console.log(`Cache hit for ${weekKey}`);
      return NextResponse.json({
        success: true,
        risingPlayers: JSON.parse(cachedData),
        cached: true,
        weekRange
      });
    }

    // Cache miss, query the database
    console.log(`Cache miss for ${weekKey}, querying database`);
    
    // Query database for the single JSON record for this week
    const weekData = await prismadb.risingStarsWeekData.findUnique({
      where: { week_key: weekKey }
    });
    
    // If no data found in the database
    if (!weekData) {
      return NextResponse.json({
        success: false,
        message: "No rising stars data available for this week",
        weekRange
      });
    }
    
    // Parse the JSON data from the database
    const risingPlayers = weekData.data;
    
    // Store in cache (expire after 1 hour)
    await redis.set(weekKey, JSON.stringify(risingPlayers), "EX", 3600);
    
    return NextResponse.json({
      success: true,
      risingPlayers,
      cached: false,
      weekRange
    });
    
  } catch (error) {
    console.error("Error fetching rising stars data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch rising stars data" },
      { status: 500 }
    );
  }
}