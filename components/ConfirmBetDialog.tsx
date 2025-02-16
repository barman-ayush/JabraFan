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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type BetType = 'free' | 'paid';

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
    const [betType, setBetType] = useState<BetType>('paid');
    const balance = betType === 'paid' ? 100 : 1000; // Money vs Points

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
                    {/* Question and Answer Section */}
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
                        {/* Bet Type Selector */}
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">
                                Bet Type
                            </Label>
                            <Select
                                value={betType}
                                onValueChange={(value: BetType) => {
                                    setBetType(value);
                                    setAmount("");
                                }}
                            >
                                <SelectTrigger className="w-full bg-transparent border-[hsl(var(--border-color))]">
                                    <SelectValue placeholder="Select bet type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="free">Free (Points)</SelectItem>
                                    <SelectItem value="paid">Paid (Money)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Balance Display */}
                        <div className="flex items-center justify-between">
                            <Label className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                                Available {betType === 'paid' ? 'Balance' : 'Points'}
                            </Label>
                            <span className="text-sm sm:text-base font-semibold">
                                {betType === 'paid' ? '$' : ''}{balance}
                            </span>
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-sm sm:text-base">
                                Bet {betType === 'paid' ? 'Amount' : 'Points'}
                            </Label>
                            <div className="relative">
                                {betType === 'paid' && (
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]">
                                        $
                                    </span>
                                )}
                                <Input
                                    id="amount"
                                    type="number"
                                    min="1"
                                    max={balance}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className={cn(
                                        "text-sm sm:text-base",
                                        "bg-transparent border-[hsl(var(--border-color))]",
                                        "placeholder:text-[hsl(var(--muted-foreground))]",
                                        betType === 'paid' ? "pl-7" : "pl-3"
                                    )}
                                    placeholder={`Enter ${betType === 'paid' ? 'amount' : 'points'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
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
                        Place {betType === 'paid' ? 'Bet' : 'Points Bet'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
