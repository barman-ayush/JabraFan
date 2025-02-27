import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import crypto from "crypto";
import { cookies } from "next/headers";
import { ErrorLogger } from "@/lib/utils";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { phone, otp }: { phone: string, otp: string } = body;
        
        if (!phone || !otp) {
            return new NextResponse(
                JSON.stringify({ message: "Phone and OTP are required" }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // Retrieve OTP data from Redis
        const otpDataString = await redis.get(phone);
        
        if (!otpDataString) {
            return new NextResponse(
                JSON.stringify({ message: "OTP expired or not found. Please request a new one." }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const otpData = JSON.parse(otpDataString);
        
        // Update attempts count
        otpData.attempts = (otpData.attempts || 0) + 1;
        
        // Check if max attempts reached (optional)
        if (otpData.attempts > 5) {
            // Delete the OTP data to prevent further attempts
            await redis.del(phone);
            return new NextResponse(
                JSON.stringify({ message: "Too many failed attempts. Please request a new OTP." }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // Update the attempts count in Redis
        await redis.set(phone, JSON.stringify(otpData), 'KEEPTTL');
        
        // Decrypt and verify OTP
        const algorithm = 'aes-256-ctr';
        const secretKey = process.env.OTP_SECRET_KEY || 'default-secret-key-change-in-production';
        const iv = Buffer.from(otpData.iv, 'hex');
        const encryptedOTP = Buffer.from(otpData.encryptedOTP, 'hex');
        
        const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
        const decryptedOTP = Buffer.concat([
            decipher.update(encryptedOTP),
            decipher.final()
        ]).toString();
        
        // Check if OTP matches
        if (decryptedOTP !== otp) {
            return new NextResponse(
                JSON.stringify({ 
                    message: "Invalid OTP. Please try again.",
                    attemptsLeft: 5 - otpData.attempts
                }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // OTP is valid - set the authentication cookie
        const cookieStore = await cookies();
        
        // Set authentication cookie (expires in 30 days)
        cookieStore.set('auth_token', phone, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/'
        });
        
        // Delete the OTP data since it's been successfully used
        await redis.del(phone);
        
        return new NextResponse(
            JSON.stringify({ message: "OTP verified successfully", userId: otpData.userId }), 
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (e) {
        return ErrorLogger("VERIFY_OTP_POST", e);
    }
}