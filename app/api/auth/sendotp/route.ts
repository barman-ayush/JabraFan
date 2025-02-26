import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import ErrorHandler from "@/lib/errorHandler";
import prismadb from "@/lib/prismadb";
import twilio from "twilio";
import crypto from "crypto";
import { ErrorLogger } from "@/lib/utils";

const defaultProfileImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQttE9sxpEu1EoZgU2lUF_HtygNLCaz2rZYHg&s";
const initialCredits = 100;
const OTP_EXPIRY = 60 * 10; // 10 minutes in seconds

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

        let userData = await prismadb.user.findUnique({
            where : {
                phone : phone
            }
        })

        if(!userData){
            if(resend == "1") return new NextResponse("Can't find any user, please use your phone number again!", { status: 400 }); 
            userData = await prismadb.user.create({
                data : {
                    name : `user${phone}`,
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

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        const algorithm = 'aes-256-ctr';
        const secretKey = process.env.OTP_SECRET_KEY || 'default-secret-key-change-in-production';
        const iv = crypto.randomBytes(16);
        
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
        const encryptedOTP = Buffer.concat([
            cipher.update(otp, 'utf8'),
            cipher.final()
        ]);
        
        const otpData = {
            encryptedOTP: encryptedOTP.toString('hex'),
            iv: iv.toString('hex'),
            userId: userData.id,
            attempts: existingOtpData ? (existingOtpData.attempts || 0) : 0,
            resendCount: existingOtpData ? ((existingOtpData.resendCount || 0) + 1) : 0
        };
        
        await redis.set(phone, JSON.stringify(otpData), 'EX', OTP_EXPIRY);
        
        await twilioClient.messages.create({
            body: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });

        const message = resend === "1" ? "New OTP sent successfully" : "OTP sent successfully";
        return new NextResponse(JSON.stringify({ message }), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error: any) {
        return ErrorLogger("SEND_OTP_POST", error);
    }
}