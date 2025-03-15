/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";



const MinimumWithdrawalAmount = 5;

export async function POST(req: NextRequest) {
  try {
    const { userId, amount, paymentMethod, paymentDetails } = await req.json();

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.winnings < amount) {
      return NextResponse.json(
        { error: "Insufficient balance", currentBalance: user.winnings },
        { status: 400 }
      );
    }

    if (amount < MinimumWithdrawalAmount) {
      return NextResponse.json(
        { error: "Minimum withdrawal is 500" },
        { status: 400 }
      );
    }

    // Use a transaction to ensure both operations succeed or fail together
    const result = await prismadb.$transaction(async (prisma) => {
      // Create the redeem request
      const request = await prisma.redeemRequests.create({
        data: {
          userId,
          amount,
          status: "pending",
          paymentMethod,
          paymentDetails,
          requestedAt: new Date(),
        },
      });

      // Update user balance
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          winnings: {
            decrement: amount,
          },
        },
      });

      return request;
    });

    return NextResponse.json({
      success: true,
      requestId: result.id,
      message: "Redemption request submitted successfully",
    });
  } catch (error) {
    console.error("Error processing redemption:", error);

    // More specific error handling
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process redemption";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
