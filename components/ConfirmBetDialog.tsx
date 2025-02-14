"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmBetDialogProps = {
    trigger: React.ReactNode;
    question: string;
    selectedOption: string | null;
};

export default function ConfirmBetDialog({
    trigger,
    question,
    selectedOption,
}: ConfirmBetDialogProps) {
    const [amount, setAmount] = useState<string>("");
    const balance = 100;

    if (!selectedOption) {
        return (
            <Dialog>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent className="bg-gradient-to-b from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] border-[hsl(var(--border-color))] w-[95%] max-w-md mx-auto rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl font-semibold">
                            Select an Option
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-sm sm:text-base">
                        Please select an option before confirming your bet.
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="bg-gradient-to-b from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] border-[hsl(var(--border-color))] w-[95%] max-w-md mx-auto p-4 sm:p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Confirm Your Bet
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2 rounded-lg bg-transparent p-3 sm:p-4">
              <div className="space-y-1">
                <Label className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                  Question
                </Label>
                <p className="text-sm sm:text-base font-medium">{question}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                  Your Answer
                </Label>
                <p className="text-sm sm:text-base font-medium text-[hsl(var(--primary))]">
                  {selectedOption}
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                  Available Balance
                </Label>
                <span className="text-sm sm:text-base font-semibold">
                  ${balance}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm sm:text-base">
                  Bet Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    max={balance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={cn(
                      "pl-7 text-sm sm:text-base",
                      "bg-transparent border-[hsl(var(--border-color))]",
                      "placeholder:text-[hsl(var(--muted-foreground))]"
                    )}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 sm:mt-6">
            <Button
              type="submit"
              disabled={!amount || Number(amount) > balance}
              className={cn(
                "w-full text-sm text-black bg-[hsl(var(--primary-button))] sm:text-base py-2 sm:py-2.5",
                !amount || Number(amount) > balance
                  ? "opacity-50 cursor-not-allowed"
                  : "text-white hover:bg-[hsl(var(--primary-button-hover))]"
              )}
            >
              Place Bet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}
