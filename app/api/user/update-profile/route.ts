/* eslint-disable @typescript-eslint/no-explicit-any */
import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest
) {
    try {
        const {upiId , userId} = await request.json();
        if(!upiId || !userId) return NextResponse.json({success : false, message : "Data not available !!"});
        
        const updatedUser = await prismadb.user.update({
            where : {id : userId},
            data : {
                upiId : upiId
            }
        })
        return NextResponse.json({success : true , message : "UPI Updated Sucesfully !" , data : updatedUser});

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("Error completing match:", errorMessage);

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}