import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: NextRequest) {
  try {
    const { userId, amount } = await req.json();

    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || user.winnings < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    if (amount < 500) {
      return NextResponse.json(
        { error: "Minimum withdrawal is 500" },
        { status: 400 }
      );
    }

    await prismadb.redeemRequests.create({
      data: {
        userId,
        amount,
        status: "pending",
      },
    });

    await prismadb.user.update({
      where: {
        id: userId,
      },
      data: {
        winnings: {
          decrement: amount,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing redemption:", error);
    return NextResponse.json(
      { error: "Failed to process redemption" },
      { status: 500 }
    );
  }
}
