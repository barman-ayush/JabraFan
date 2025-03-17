/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import prismadb from "@/lib/prismadb";
import twilio from "twilio";
import crypto from "crypto";
import { ErrorLogger } from "@/lib/utils";

const defaultProfileImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQttE9sxpEu1EoZgU2lUF_HtygNLCaz2rZYHg&s";
const initialCredits = 100;
const OTP_EXPIRY = 60 * 10; // in seconds

// Rate limiting constants
const MAX_REQUESTS = 500;
const RATE_LIMIT_WINDOW = 60 * 60; // in seconds 

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { phone } : {phone : string} = body;
        const resend = (new URL(req.url)).searchParams.get('resend');

        if(!phone) return new NextResponse("Phone Number is required !!" , {status : 400})

        // Rate limiting implementation
        const rateLimitKey = `rate_limit:${phone}`;
        const currentRequests = await redis.get(rateLimitKey);
        
        if (currentRequests !== null) {
            const requestCount = parseInt(currentRequests);
            if (requestCount >= MAX_REQUESTS) {
                return new NextResponse(JSON.stringify({ 
                    message: "Too many requests. Please try again later." 
                }), { 
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            await redis.incr(rateLimitKey);
        } else {
            // First request in the window
            await redis.setex(rateLimitKey, RATE_LIMIT_WINDOW, 1);
        }

        let userData = await prismadb.user.findUnique({
            where : {
                phone : phone
            }
        })

        if(!userData){
            if(resend == "1") return new NextResponse("Can't find any user, please use your phone number again!", { status: 400 }); 
            userData = await prismadb.user.create({
                data : {
                    name : `NOT_ASSIGNED`,
                    src : defaultProfileImage,
                    phone,
                    credits : initialCredits,
                }
            });
        }

        // Check if there's existing OTP data for resend
        let existingOtpData = null;
        if (resend === "1") {
            const cachedData = await redis.get(phone);
            if (cachedData) {
                existingOtpData = JSON.parse(cachedData);
                
                // Verify this belongs to the same user
                if (existingOtpData.userId !== userData.id) {
                    return new NextResponse("Invalid request", { status: 400 });
                }
            }
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Encrypt the OTP
        const algorithm = 'aes-256-ctr';
        const secretKey = process.env.OTP_SECRET_KEY || 'default-secret-key-change-in-production';
        const iv = crypto.randomBytes(16);
        console.log("Here 1" , secretKey);
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
        const encryptedOTP = Buffer.concat([
            cipher.update(otp, 'utf8'),
            cipher.final()
        ]);
        
        // Store encrypted data with IV in Redis
        const otpData = {
            encryptedOTP: encryptedOTP.toString('hex'),
            iv: iv.toString('hex'),
            userId: userData.id,
            attempts: existingOtpData ? (existingOtpData.attempts || 0) : 0,
            resendCount: existingOtpData ? ((existingOtpData.resendCount || 0) + 1) : 0
        };
        console.log("Here 2");
        
        // Cache in Redis with expiry
        await redis.set(phone, JSON.stringify(otpData), 'EX', OTP_EXPIRY);
        
        // Send OTP via Twilio
        await twilioClient.messages.create({
            body: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });

        const message = resend === "1" ? "New OTP sent successfully" : "OTP sent successfully";
        return new NextResponse(JSON.stringify({ 
            message,
            remainingAttempts: MAX_REQUESTS - (parseInt(await redis.get(rateLimitKey) || "1"))
        }), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error: any) {
        return ErrorLogger("SEND_OTP_POST", error);
    }
}