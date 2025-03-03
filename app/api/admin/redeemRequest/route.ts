import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const requests = await prismadb.redeemRequests.findMany();

    return NextResponse.json(requests, { status: 200 });
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
    const { requestId } = body;

    await prismadb.redeemRequests.update({
      where: {
        id: requestId,
      },
      data: {
        status: "completed",
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
