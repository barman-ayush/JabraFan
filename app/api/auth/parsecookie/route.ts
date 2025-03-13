import { ErrorLogger } from "@/lib/utils";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prismadb from "@/lib/prismadb";

const JWT_SECRET = process.env.JWT_SECRET!;


export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ success : false , error: "Not Logged In" }, { status: 401 });
        }
        const decodedData : any = jwt.verify(token, JWT_SECRET);
        console.log("[ PARSE_COOKIE_DECODED]" , decodedData);
        const userData = await prismadb.user.findUnique({where : {id : decodedData.id}})
        return NextResponse.json({ success : true , userData: userData }, { status: 200 });
    } catch (e) {
        return ErrorLogger("[ PARSE_COOKIE_POST ] : ", e);
    }
}