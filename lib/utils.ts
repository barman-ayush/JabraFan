import { clsx, type ClassValue } from "clsx"
import { NextRequest, NextResponse } from "next/server";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ErrorLogger(errorSource : string, error : any ) {
  console.log(` [ ${errorSource} ] : `);
  console.log(error?.statusCode, error?.message);
  return new NextResponse("Internal Server Error", { status: 500 });
}