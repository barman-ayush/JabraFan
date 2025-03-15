/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const matches = await prismadb.matches.findMany({
      include: { questions: true },
    });

    return NextResponse.json(matches);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
