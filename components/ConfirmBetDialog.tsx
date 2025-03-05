"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
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
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

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
    const [open, setOpen] = useState(false);

    if (!selectedOption) {
        return (
            <Dialog>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Select an Option</DialogTitle>
                        <DialogDescription>
                            Please select an option before confirming your bet.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Your Bet</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Question and Answer Section */}
                    <Card className="bg-muted/50">
                        <CardContent className="pt-6 space-y-3">
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">
                                    Question
                                </Label>
                                <p className="font-medium">{question}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">
                                    Your Answer
                                </Label>
                                <p className="font-medium text-primary">
                                    {selectedOption}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        {/* Bet Type Selector */}
                        <div className="space-y-2">
                            <Label htmlFor="bet-type">
                                Bet Type
                            </Label>
                            <Select
                                value={betType}
                                onValueChange={(value: BetType) => {
                                    setBetType(value);
                                    setAmount("");
                                }}
                            >
                                <SelectTrigger id="bet-type" className="w-full">
                                    <SelectValue placeholder="Select bet type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="free">Free (Points)</SelectItem>
                                    <SelectItem value="paid">Paid (Money)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Balance Display */}
                        <div className="flex items-center justify-between rounded-md border p-3 bg-background">
                            <Label className="text-muted-foreground">
                                Available {betType === 'paid' ? 'Balance' : 'Points'}
                            </Label>
                            <span className="font-semibold">
                                {betType === 'paid' ? '$' : ''}{balance}
                            </span>
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-2">
                            <Label htmlFor="amount">
                                Bet {betType === 'paid' ? 'Amount' : 'Points'}
                            </Label>
                            <div className="relative">
                                {betType === 'paid' && (
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
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
                                        betType === 'paid' ? "pl-7" : "pl-3"
                                    )}
                                    placeholder={`Enter ${betType === 'paid' ? 'amount' : 'points'}`}
                                />
                            </div>
                            {amount && Number(amount) > balance && (
                                <div className="flex items-center text-destructive gap-1 text-sm mt-1">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Amount exceeds available {betType === 'paid' ? 'balance' : 'points'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter>
                    <Button
                        type="submit"
                        disabled={!amount || Number(amount) > balance}
                        className="w-full"
                    >
                        Place {betType === 'paid' ? 'Bet' : 'Points Bet'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}