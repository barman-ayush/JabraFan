/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFlash } from "./Flash.component";
import { Question } from "@/utils/types";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  CheckIcon,
  XIcon,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useUserContext } from "@/context/UserContext";

type QuestionProps = {
  id: number;
  question: Question;
  options: string[];
};

export default function Questions({ id, question, options }: QuestionProps) {
  const { flash } = useFlash();
  const { userData , setUserData } = useUserContext();
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );
  const [userAnswer, setUserAnswer] = useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAnsweredByAdmin = question.status === "answered";
  const isAnsweredByUser = userAnswer !== null && userAnswer !== undefined;
  const isQuestionActive = question.isActive;

  const handleSubmitAnswer = async () => {
    try {
      setIsSubmitting(true);
      // Is the question active to be answered
      if (!question.isActive) {
        flash("Question not active !", { variant: "warning" });
        return;
      }
      // Update userAnswer state to track that user has answered
      const response = await fetch("/api/user/answer", {
        method: "POST",
        body: JSON.stringify({
          questionId: question.id,
          userId: userData?.id,
          answer: selectedOption,
        }),
      });
      const data = await response.json();
      console.log("[ DATA ] : ", data);

      if (!response.ok) {
        flash(data.error, { variant: "error" });
        return;
      }
      if (data.success){
        setUserAnswer(selectedOption);
        setUserData(data.updatedUserData)
        
      }
      flash("Prediction submitted successfully!", { variant: "info" });
    } catch (e: any) {
      console.log("Error ", e);
      flash("Answer Not Submitted!", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // fetch the answer made by the user
    const getUserAnswer = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/user/answer?userId=${userData?.id}&questionId=${question.id}`
        );

        if (!response.ok) {
          console.error("Failed to fetch user answer");
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        console.log(" [FETCHED_ANSWER_BY_USER] ", data);

        if (data.success && data.answer) {
          setUserAnswer(data.answer.answer);
        } else {
          setUserAnswer(undefined); // Explicitly set to undefined if no answer found
        }
      } catch (error) {
        console.error("Error fetching user answer:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData?.id && question.id) {
      getUserAnswer();
    } else {
      setIsLoading(false);
    }
  }, [userData?.id, question.id]);

  // Helper to determine if user's answer matches admin's answer
  const isUserAnswerCorrect = () => {
    return (
      isAnsweredByAdmin && isAnsweredByUser && userAnswer === question.answer
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading question data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Question title on its own row for mobile, alongside tags on larger screens */}
          <div className="mb-2 md:mb-0">
            <CardTitle className="text-xl">{question.text}</CardTitle>
          </div>

          {/* Status indicators in a separate row on mobile, right-aligned */}
          <div className="flex justify-end md:justify-start items-center">
            <div className="ml-2">
              {isAnsweredByAdmin ? (
                <div className=""></div>
              ) : isAnsweredByUser ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">
                    Prediction submitted
                  </span>
                </div>
              ) : !isQuestionActive ? (
                <div className="flex items-center text-amber-600">
                  <AlertTriangle className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Prediction Closed</span>
                </div>
              ) : (
                <div className="flex items-center text-blue-600">
                  <Clock className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">
                    Open for predictions
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <RadioGroup
          value={userAnswer || selectedOption || ""}
          onValueChange={setSelectedOption}
          className="space-y-3"
          disabled={isAnsweredByAdmin || isAnsweredByUser || !isQuestionActive}
        >
          {options.map((option, index) => {
            // Determine the styling for each option
            let optionClass =
              "flex items-center space-x-2 rounded-lg border p-3 transition-colors ";

            // User's selected answer
            if (userAnswer === option) {
              if (isAnsweredByAdmin) {
                optionClass +=
                  userAnswer === question.answer
                    ? "border-green-500 bg-green-50/70 "
                    : "border-red-500 bg-red-50/70 ";
              } else {
                optionClass += "border-blue-500 bg-blue-50/70 ";
              }
            }
            // Current selection (not submitted)
            else if (selectedOption === option) {
              optionClass += "border-primary bg-primary/5 ";
            }
            // Admin's correct answer (not user's pick)
            else if (isAnsweredByAdmin && question.answer === option) {
              optionClass += "border-green-500 bg-green-50/70 ";
            }
            // Other options
            else {
              optionClass +=
                isAnsweredByAdmin || isAnsweredByUser || !isQuestionActive
                  ? "cursor-not-allowed bg-muted/20 "
                  : "hover:bg-muted/20 cursor-pointer ";
            }

            return (
              <div key={index} className={optionClass}>
                <RadioGroupItem
                  value={option}
                  id={`${option}-${id}`}
                  className="mr-1"
                  disabled={
                    isAnsweredByAdmin || isAnsweredByUser || !isQuestionActive
                  }
                />
                <Label
                  htmlFor={`${option}-${id}`}
                  className={`flex-1 ${
                    isAnsweredByAdmin || isAnsweredByUser || !isQuestionActive
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } font-medium flex justify-between items-center text-foreground`}
                >
                  <span>{option}</span>

                  <div className="flex items-center">
                    {/* "Your answer" badge */}
                    {userAnswer === option && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mr-2">
                        Your answer
                      </span>
                    )}

                    {/* Show check mark for correct answer */}
                    {isAnsweredByAdmin && question.answer === option && (
                      <CheckIcon className="h-5 w-5 text-green-600" />
                    )}

                    {/* Show X mark for user's wrong answer */}
                    {userAnswer === option &&
                      isAnsweredByAdmin &&
                      userAnswer !== question.answer && (
                        <XIcon className="h-5 w-5 text-red-600" />
                      )}
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        {/* Various status messages */}
        {isAnsweredByAdmin && isAnsweredByUser && (
          <div
            className={`mt-4 p-3 border rounded-md text-sm ${
              isUserAnswerCorrect()
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-start">
              {isUserAnswerCorrect() ? (
                <>
                  <CheckIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">
                      Your answer is correct, and you&apos;ve earned reward
                      points
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">
                      Your answer is incorrect. But don&apos;t worry, keep
                      trying and earn more reward points! 😊
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {isAnsweredByAdmin && !isAnsweredByUser && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>Predictions are closed for this question.</p>
            </div>
          </div>
        )}

        {!isAnsweredByAdmin && isAnsweredByUser && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>
                Your prediction has been submitted. Waiting for the final
                result.
              </p>
            </div>
          </div>
        )}

        {!isQuestionActive && !isAnsweredByUser && !isAnsweredByAdmin && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>Predictions are closed for this question.</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end pt-2">
        {!isAnsweredByUser && !isAnsweredByAdmin ? (
          isQuestionActive ? (
            <Button
              size="lg"
              disabled={!selectedOption || isSubmitting}
              className="font-medium"
              onClick={handleSubmitAnswer}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Prediction"
              )}
            </Button>
          ) : (
            <Button
              size="lg"
              disabled
              variant="outline"
              className="font-medium"
            >
              Prediction Closed
            </Button>
          )
        ) : isAnsweredByUser ? (
          <Button size="lg" disabled variant="outline" className="font-medium">
            Prediction Submitted
          </Button>
        ) : (
          <Button size="lg" disabled variant="outline" className="font-medium">
            Prediction Closed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
