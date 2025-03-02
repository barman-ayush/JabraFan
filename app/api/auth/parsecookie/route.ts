import { ErrorLogger } from "@/lib/utils";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ success : false , error: "Not Logged In" }, { status: 401 });
        }
        const decodedData = jwt.verify(token, JWT_SECRET);
        return NextResponse.json({ success : true , userData: decodedData }, { status: 200 });
    } catch (e) {
        return ErrorLogger("[ PARSE_COOKIE_POST ] : ", e);
    }
}