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

    // Update the request status in the database
    await prismadb.redeemRequests.update({
      where: {
        id: requestId,
      },
      data: {
        status,
        processedAt: new Date(),
        rejectionReason: status === "rejected" ? rejectionReason : null,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to update redeem request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
