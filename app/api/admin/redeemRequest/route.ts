/* eslint-disable @typescript-eslint/no-explicit-any */
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const requests = await prismadb.redeemRequests.findMany({
      include: {
        requested: true, // Include the related User data
      },
    });

    // Map the data to include username and email from the user
    const formattedRequests = requests.map((req) => ({
      id: req.id,
      amount: req.amount,
      status: req.status,
      userId: req.userId,
      username: req.requested.name, // Use the user's name as username
      email: req.requested.phone, // Use phone as contact (adjust as needed)
      paymentMethod: req.paymentMethod || "Direct Transfer",
      paymentDetails: req.paymentDetails || req.requested.upiId || "",
      requestedAt: req.requestedAt.toISOString(),
      processedAt: req.processedAt ? req.processedAt.toISOString() : null,
      rejectionReason: req.rejectionReason || null,
    }));

    return NextResponse.json(formattedRequests, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch redeem requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requestId, status, rejectionReason } = body;

    if (!requestId || !status) {
      return NextResponse.json(
        { error: "Request ID and status are required" },
        { status: 400 }
      );
    }

    // Use a transaction to handle all database operations atomically
    const result = await prismadb.$transaction(async (tx) => {
      // First, get the current request state
      const currentRequest = await tx.redeemRequests.findUnique({
        where: { id: requestId },
        select: { status: true, userId: true, amount: true }
      });

      // Check if request exists
      if (!currentRequest) {
        throw new Error("Request not found");
      }

      // Only proceed if current status is "pending"
      if (currentRequest.status !== "pending") {
        throw new Error(`Request Already processed !!`);
      }

      // Update the request status
      const updatedRequest = await tx.redeemRequests.update({
        where: { id: requestId },
        data: {
          status,
          processedAt: new Date(),
          rejectionReason: status === "rejected" ? rejectionReason : null,
        },
      });

      // If rejected, return the amount to user's winnings in the same transaction
      if (status === "rejected") {
        await tx.user.update({
          where: { id: currentRequest.userId },
          data: {
            winnings: { increment: currentRequest.amount }
          }
        });
      }

      return updatedRequest;
    });

    console.log("[ UPDATED_DATA ] : ", result);
    
    return NextResponse.json({ 
      success: true,
      message: `Request ${status === "approved" ? "approved" : "rejected"} successfully`
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Failed to update redeem request:", error);
    
    // Handle specific error messages from transaction
    if (error.message === "Request not found") {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    } 
    
    if (error.message.includes("Cannot update request with status")) {
      return NextResponse.json({ 
        error: "Cannot update this request as it's already processed" 
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}