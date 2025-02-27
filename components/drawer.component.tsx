"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { InputOTPBox } from "./InputOtp.component";
import { motion, AnimatePresence } from "framer-motion";
import { useFlash } from "./Flash.component";

export function DrawerWrapper({ children }: { children: React.ReactNode }) {
  const { flash } = useFlash();

  const [step, setStep] = React.useState<"phone" | "loading" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [otp , setOtp] = React.useState("");

  const handlePhoneSubmit = async () => {
    if (!phoneNumber || phoneNumber.length < 10) return;

    setStep("loading");

    try {
      // Replace with your actual API call to send OTP
      const response = await fetch("/api/auth/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phoneNumber}` }),
      });

      if (!response.ok) throw new Error("Failed to send OTP");

      // Move to OTP step after 1.5 seconds for better UX
      setTimeout(() => setStep("otp"), 1500);
    } catch (error) {
      console.error("Error sending OTP:", error);
      flash("Error Sending OTP , Please retry !!", { variant: "error" });
      setStep("phone"); // Go back to phone input on error
    }
  };

  const resetFlow = () => {
    setStep("phone");
    setPhoneNumber("");
  };

  const handleVerifyOTP = async () => {
    try {
      if(otp.length  != 6) throw new Error("Incomplete OTP !");
      const response = await fetch("/api/auth/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phoneNumber}` , otp : otp}),
      });

      if (!response.ok) throw new Error("Failed to send OTP");
      flash("Welcome to JabraFan !", { variant: "success" });
    } catch (e : any) {
      flash(e.message , {variant : "warning"})
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="py-4">
            <DrawerTitle>
              {step === "phone"
                ? "Enter your phone number"
                : step === "loading"
                ? "Sending verification code"
                : "Verify your phone number"}
            </DrawerTitle>
            <DrawerDescription>
              {step === "phone"
                ? "We'll send you a code to verify your phone number"
                : step === "loading"
                ? "Please wait..."
                : `Enter the 6-digit code sent to +91 ${phoneNumber}`}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-4 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === "phone" && (
                <motion.div
                  key="phone-input"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">
                      +91
                    </span>
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      maxLength={10}
                    />
                  </div>
                  <Button
                    onClick={handlePhoneSubmit}
                    disabled={phoneNumber.length < 10}
                  >
                    Send Code
                  </Button>
                </motion.div>
              )}

              {step === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Sending verification code...
                  </p>
                </motion.div>
              )}

              {step === "otp" && (
                <motion.div
                  key="otp-input"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex justify-center py-2">
                    <InputOTPBox value={otp} onChange={setOtp} />
                  </div>
                  <div className="flex justify-between">
                    <Button variant="ghost" size="sm" onClick={resetFlow}>
                      Change Number
                    </Button>
                    <Button variant="ghost" size="sm">
                      Resend Code
                    </Button>
                  </div>
                  <Button onClick={handleVerifyOTP}>Verify</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
