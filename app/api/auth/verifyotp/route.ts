/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import crypto from "crypto";
import { cookies } from "next/headers";
import { ErrorLogger } from "@/lib/utils";
import prismadb from "@/lib/prismadb";
import jwt, { Secret } from "jsonwebtoken";

const defaultDpLink = "https://www.google.com/url?sa=i&url=https%3A%2F%2Ficonduck.com%2Ficons%2F6491%2Fprofile-default&psig=AOvVaw3zemqLK7JNwYOPOpT1diVO&ust=1740917134676000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPiBqvPr6IsDFQAAAAAdAAAAABAE";

const INITIAL_AMOUNT: number = parseInt(process.env.INITIAL_AMOUNT!);
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key-change-in-production";
const JWT_EXPIRES_IN = '30d';

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

        // Check for existing user in db : 
        let userData = await prismadb.user.findFirst({ where: { phone: phone } });
        if (!userData) {
            // Store Data in database
            userData = await prismadb.user.create({
                data: {
                    name: `user@${phone}`,
                    src: defaultDpLink,
                    phone: `${phone}`,
                    credits: INITIAL_AMOUNT,
                },
            });
        }
        console.log(" [ DATABASE_FETCH ] : ", userData);

        // Create a JWT token with the user data
        // Only include necessary user data in the token payload
        const tokenPayload = {
            id: userData.id,
            phone: userData.phone,
            name: userData.name,
            // Don't include sensitive information in the JWT payload
            // The JWT is encoded but not encrypted
        };

        // Sign the JWT token
        const token = jwt.sign(tokenPayload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        // Set the JWT token in a cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
            path: '/'
        });

        // Delete the OTP data since it's been successfully used
        await redis.del(phone);

        // Return user data (but not the JWT token)
        return new NextResponse(
            JSON.stringify({ 
                message: "OTP verified successfully", 
                userData: {
                    id: userData.id,
                    name: userData.name,
                    phone: userData.phone,
                    credits: userData.credits,
                    src: userData.src
                }
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (e) {
        return ErrorLogger("VERIFY_OTP_POST", e);
    }
}