"use client";
import React from "react";
import ConfirmBetDialog from "./ConfirmBetDialog";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type QuestionProps = {
  id: number;
  question: string;
  options: string[];
};

export default function Questions({ id, question, options }: QuestionProps) {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{question}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <RadioGroup
          value={selectedOption || ""}
          onValueChange={setSelectedOption}
          className="space-y-3"
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 rounded-lg border p-3 transition-colors ${
                selectedOption === option
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted"
              }`}
            >
              <RadioGroupItem 
                value={option} 
                id={`${option}-${id}`} 
                className="mr-1"
              />
              <Label
                htmlFor={`${option}-${id}`}
                className="flex-1 cursor-pointer font-medium"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      
      <CardFooter className="flex justify-end pt-2">
        <ConfirmBetDialog
          question={question}
          selectedOption={selectedOption}
          trigger={
            <Button 
              size="lg" 
              disabled={!selectedOption}
              className="font-medium"
            >
              Start Bet
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}