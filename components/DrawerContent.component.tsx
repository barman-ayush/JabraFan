/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UserCircle } from "lucide-react";
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { InputOTPBox } from "./InputOtp.component";
import { motion, AnimatePresence } from "framer-motion";
import { useFlash } from "./Flash.component";
import { useDrawerContext } from "@/context/DrawerContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

export function DrawerContentWithParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { flash } = useFlash();
  const { isOpen, setIsOpen } = useDrawerContext();
  const { userData, setUserData } = useUserContext();

  const [step, setStep] = React.useState<"phone" | "loading" | "otp" | "name">(
    "phone"
  );
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isUpdatingName, setIsUpdatingName] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const redirect_url = searchParams.get("redirect_url") || "/";

  // Close drawer if user is already logged in
  React.useEffect(() => {
    if (isOpen && userData) {
      setIsOpen(false);
      flash("You are already logged in", { variant: "info" });
    }
  }, [isOpen, userData, setIsOpen, flash]);

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
      flash("Error Sending OTP, Please retry!", { variant: "error" });
      setStep("phone");
    }
  };

  const resetFlow = () => {
    setStep("phone");
    setPhoneNumber("");
    setOtp("");
    setUserName("");
    setUserId("");
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      flash("Incomplete OTP!", { variant: "warning" });
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phoneNumber}`, otp: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      const userData = data.userData;
      console.log(" [ VERIFY_OTP_RESPONSE ] ", userData);

      // Check if user needs to set a name
      if (
        userData.name === "NOT_ASSIGNED" ||
        userData.name === `user+91${phoneNumber}`
      ) {
        setUserId(userData.id);
        setStep("name");
      } else {
        // User already has a name, complete the flow
        completeSignIn(userData);
      }
      router.push("/");
    } catch (e: any) {
      flash(e.message || "Verification failed", { variant: "warning" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNameSubmit = async () => {
    if (!userName.trim()) {
      flash("Please enter your name", { variant: "warning" });
      return;
    }

    setIsUpdatingName(true);

    try {
      const response = await fetch("/api/user/setname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          name: userName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update name");
      }

      // Complete sign in with updated user data
      completeSignIn(data.userData);
    } catch (error: any) {
      flash(error.message || "Failed to update name", { variant: "error" });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const completeSignIn = (userData: any) => {
    setUserData(userData);
    flash("Welcome to JabraFan!", { variant: "success" });
    setIsOpen(false);

    try {
      const destinationURL = new URL(redirect_url, window.location.origin);
      // router.push(destinationURL.pathname);
      window.location.href = destinationURL.pathname;
      console.log(" DESTINATION ", destinationURL);
    } catch (error: any) {
      console.log("ERROR ", error);
      router.push("/");
    }

    resetFlow();
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <DrawerHeader className="py-4">
        <DrawerTitle>
          {step === "phone"
            ? "Enter your phone number"
            : step === "loading"
            ? "Sending verification code"
            : step === "otp"
            ? "Verify your phone number"
            : "Tell us your name"}
        </DrawerTitle>
        <DrawerDescription>
          {step === "phone"
            ? "We'll send you a code to verify your phone number"
            : step === "loading"
            ? "Please wait..."
            : step === "otp"
            ? `Enter the 6-digit code sent to +91 ${phoneNumber}`
            : "Please enter your name to complete your profile"}
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
                <span className="text-sm text-muted-foreground mr-2">+91</span>
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
              <Button
                onClick={handleVerifyOTP}
                disabled={isVerifying || otp.length !== 6}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </motion.div>
          )}

          {step === "name" && (
            <motion.div
              key="name-input"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col items-center justify-center py-2">
                <UserCircle className="h-16 w-16 text-primary mb-4" />
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground text-center">
                  This will be displayed on your profile
                </p>
              </div>
              <Button
                onClick={handleNameSubmit}
                disabled={isUpdatingName || !userName.trim()}
              >
                {isUpdatingName ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
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
  );
}