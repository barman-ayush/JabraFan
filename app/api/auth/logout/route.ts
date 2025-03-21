import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();

    // Clear the auth token by setting an expired cookie with the same path and name
    (
      await // Clear the auth token by setting an expired cookie with the same path and name
      cookieStore
    ).set("auth_token", "", {
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to logout" },
      { status: 500 }
    );
  }
}
