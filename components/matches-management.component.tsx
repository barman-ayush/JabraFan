/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2 } from "lucide-react";
import { Match, Question } from "@/utils/types";
import { useFlash } from "./Flash.component";

// This interface represents the structure of questions returned from the API
interface APIQuestion {
  question: string;
}

export function MatchesManagement() {
  const { flash } = useFlash();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [selectedQuestionIndices, setSelectedQuestionIndices] = useState<
    number[]
  >([]);
  const [answers, setAnswers] = useState<Record<string, "yes" | "no" | null>>(
    {}
  );
  const [availableQuestions, setAvailableQuestions] = useState<APIQuestion[]>(
    []
  );
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [endingQuestions, setEndingQuestions] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const fetchAllMatches = async () => {
      setIsLoadingMatches(true);
      try {
        const response = await fetch("/api/admin/matches");

        if (!response.ok) {
          throw new Error(`Failed to fetch matches: ${response.status}`);
        }

        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setIsLoadingMatches(false);
      }
    };

    fetchAllMatches();
  }, []);

  const handleEndQues = async (questionId: string) => {
    try {
      // Set loading state for this specific question
      setEndingQuestions(prev => ({ ...prev, [questionId]: true }));
      
      const response = await fetch("/api/admin/endques", {
        method: "POST",
        body: JSON.stringify({ questionId: questionId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to end question: ${response.status}`);
      }

      const receivedResponse = await response.json();
      console.log("[ END_QUES ]", receivedResponse);
      
      if(!receivedResponse.success){
        flash(receivedResponse.error , {variant : "error"});
        return;
      }
      
      const { data } = receivedResponse;
      
      // Update the match data in state with the updated question
      setMatches(prevMatches => {
        return prevMatches.map(match => {
          if (match.id === selectedMatch) {
            return {
              ...match,
              questions: match.questions.map(q => {
                if (q.id === questionId) {
                  return {
                    ...q,
                    isActive: false // Update isActive status from the response
                  };
                }
                return q;
              })
            };
          }
          return match;
        });
      });
      
      flash("Question has been ended successfully", { variant: "success" });
    } catch (e) {
      console.error("Error ending question:", e);
      flash("Internal Error", { variant: "error" });
    } finally {
      // Clear loading state for this question
      setEndingQuestions(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const fetchGeneratedQuestions = async () => {
    if (!selectedMatch) return;

    setIsLoadingQuestions(true);
    try {
      const response = await fetch(`/api/match/${selectedMatch}/newquestions`);

      if (!response.ok) {
        throw new Error(`Failed to generate questions: ${response.status}`);
      }

      const data: APIQuestion[] = await response.json();

      setAvailableQuestions(Array.isArray(data) ? data : []);

      if (Array.isArray(data) && data.length > 0) {
        console.log("Question type check:", typeof data[0], data[0]);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      flash("Error Generating Questions", { variant: "error" });
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Handle dialog open
  const handleOpenQuestionDialog = () => {
    setSelectedQuestionIndices([]); // Reset selections
    setDialogOpen(true);
    fetchGeneratedQuestions(); // Fetch questions when dialog opens
  };

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatch(matchId);

    // Initialize answers for this match's questions if not already done
    const match = matches.find((m) => m.id === matchId);
    if (match) {
      const newAnswers = { ...answers };
      match.questions.forEach((q) => {
        if (!newAnswers[q.id]) {
          newAnswers[q.id] = null;
        }
      });
      setAnswers(newAnswers);
    }
  };

  const handleAnswerChange = (questionId: string, answer: "yes" | "no") => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitAnswer = async (questionId: string) => {
    const answer = answers[questionId];
    if (answer) {
      try {
        setIsAnswering(true);
        const response = await fetch("api/admin/answer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionId,
            answer,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }

        // Update the question status in our local state
        setMatches((prev) =>
          prev.map((match) => {
            if (match.id === selectedMatch) {
              return {
                ...match,
                questions: match.questions.map((q) => {
                  if (q.id === questionId) {
                    return {
                      ...q,
                      status: "answered",
                      answer,
                    };
                  }
                  return q;
                }),
              };
            }
            return match;
          })
        );

        // Show success message
        flash("Answer submitted successfully", { variant: "success" });
      } catch (error) {
        console.error("Error submitting answer:", error);
        flash("Failed to submit answer", { variant: "error" });
      } finally {
        setIsAnswering(false);
      }
    }
  };

  const handleCheckQuestion = (index: number) => {
    setSelectedQuestionIndices((prev) => {
      if (prev.includes(index)) {
        // removing that question from the selected ones
        return prev.filter((i) => i !== index);
      } else {
        // adding that to the selected ones
        return [...prev, index];
      }
    });
  };

  const handleAddQuestions = async () => {
    if (
      selectedMatch &&
      selectedQuestionIndices.length > 0 &&
      selectedMatchData
    ) {
      try {
        setIsAddingQuestion(true);
        console.log(
          "[ ADD_CHECK ] : ",
          selectedMatch,
          selectedQuestionIndices,
          selectedMatchData
        );
        // Convert selected questions to the format expected by the database
        // Based on the Question interface from /utils/types.tsx
        const newQuestions = selectedQuestionIndices.map((index) => {
          // Handle both cases: if availableQuestions contains strings or objects
          const questionData = availableQuestions[index];
          const questionText = questionData.question || "";

          // No ID needed as it will be generated by the ORM/database
          return {
            question: questionText,
            status: "unanswered",
            answer: null,
          };
        });

        // Check if this match already has questions (first time adding)
        const isFirstTimeAddingQuestions =
          selectedMatchData.questions.length === 0;

        console.log("[ BEFORE_REQUESTS ]");

        if (isFirstTimeAddingQuestions) {
          // First create the match in the database
          const createMatchResponse = await fetch("/api/admin/matches", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              matchId: selectedMatch,
              team1: selectedMatchData.team1,
              team2: selectedMatchData.team2,
              date: selectedMatchData.date,
              league: selectedMatchData.league || "Unknown League",
              questions: newQuestions,
            }),
          });

          if (!createMatchResponse.ok) {
            throw new Error("Failed to create match");
          }
        } else {
          // Add questions to existing match
          const addQuestionsResponse = await fetch(
            `/api/admin/matches/${selectedMatch}/newquestions`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                questions: newQuestions,
              }),
            }
          );
          if (!addQuestionsResponse.ok) {
            throw new Error("Failed to add questions to match");
          }
        }
        const updatedMatchResponse = await fetch(`/api/match/${selectedMatch}`);
        if (updatedMatchResponse.ok) {
          const updatedMatch = await updatedMatchResponse.json();

          // Update local state with the match data including DB-generated IDs
          setMatches((prev) =>
            prev.map((m) => (m.id === selectedMatch ? updatedMatch : m))
          );
        }

        // Reset selected questions and close dialog
        setIsAddingQuestion(false);
        setSelectedQuestionIndices([]);
        setDialogOpen(false);

        // Show success message
        flash("Questions added successfully", { variant: "success" });
      } catch (error) {
        console.error("Failed to add questions:", error);
        flash("Failed to add questions to match", { variant: "error" });
      }
    }
  };

  const handleEndContest = async () => {
    try {
      if (!selectedMatch) {
        flash("Please select a match to end", { variant: "error" });
        return;
      }
      if (!isAllAnswered()) {
        flash("Answer all question before ending", { variant: "warning" });
        return;
      }
      const response = await fetch(
        `/api/admin/matches/${selectedMatch}/endmatch`
      );
      const updatedMatch = await response.json();
      if (!response.ok) {
        flash("Couldn&apos;t end match", { variant: "error" });
        return;
      }
      setMatches((prev) =>
        prev.map((m) => (m.id === selectedMatch ? updatedMatch.data : m))
      );
      flash("Updated Successfully");
    } catch (error) {
      console.log("ERROR", error);
      flash("Could Not End Contest", { variant: "error" });
    }
  };

  const isAllAnswered = () => {
    if (!selectedMatch || !selectedMatchData?.questions) return false;
    return selectedMatchData?.questions.every((q) => {
      return (
        q.answer !== null && q.answer !== undefined && q.status !== "unanswered"
      );
    });
  };

  const selectedMatchData = selectedMatch
    ? matches.find((m) => m.id === selectedMatch)
    : null;

  return (
    <div className="space-y-6 mx-3 md:mt-20 md:mx-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 overflow-hidden">
          <CardHeader>
            <CardTitle>Current Matches</CardTitle>
            <CardDescription>
              Select a match to manage its questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {isLoadingMatches ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Loading matches...
                  </p>
                </div>
              ) : matches.length > 0 ? (
                matches.map((match) => (
                  <Button
                    key={match.id}
                    variant={selectedMatch === match.id ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => handleSelectMatch(match.id)}
                  >
                    <div className="flex flex-col items-start w-full overflow-hidden">
                      <span className="truncate w-full">
                        {match.team1} vs {match.team2}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(match.date).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No matches found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {selectedMatchData
                  ? `${selectedMatchData.team1} vs ${selectedMatchData.team2}`
                  : "Select a Match"}
              </CardTitle>
              <CardDescription>
                {selectedMatchData
                  ? new Date(selectedMatchData.date).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      dateStyle: "medium",
                      timeStyle: "short",
                    }) + " IST"
                  : "Click on a match to view and manage its questions"}
              </CardDescription>
            </div>

            {selectedMatchData && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleOpenQuestionDialog}
                    disabled={selectedMatchData.isCompleted}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {selectedMatchData.isCompleted
                      ? "Contest has ended !!"
                      : "Generate Questions"}
                  </Button>
                </DialogTrigger>
                <Button
                  onClick={handleEndContest}
                  variant={"destructive"}
                  disabled={selectedMatchData.isCompleted}
                >
                  End Contest
                </Button>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add Questions to Match</DialogTitle>
                    <DialogDescription>
                      Select questions to add to this match. These will be
                      available for users to predict.
                    </DialogDescription>
                  </DialogHeader>

                  <ScrollArea className="h-[300px] mt-4">
                    {isLoadingQuestions ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2">Generating questions...</span>
                      </div>
                    ) : availableQuestions.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p>No questions available for this match.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {availableQuestions.map(
                          (questionItem: APIQuestion, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 py-2"
                            >
                              <Checkbox
                                id={`question-${index}`}
                                checked={selectedQuestionIndices.includes(
                                  index
                                )}
                                onCheckedChange={() =>
                                  handleCheckQuestion(index)
                                }
                              />
                              <div className="grid gap-1.5 leading-none">
                                <Label
                                  htmlFor={`question-${index}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {questionItem.question}
                                </Label>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </ScrollArea>

                  <DialogFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedQuestionIndices([])}
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={handleAddQuestions}
                      disabled={
                        selectedQuestionIndices.length === 0 ||
                        isLoadingQuestions ||
                        isAddingQuestion
                      }
                    >
                      {isAddingQuestion ? (
                        <>
                          <span className="mr-2">
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              ></path>
                            </svg>
                          </span>
                          Adding...
                        </>
                      ) : (
                        <>
                          Add {selectedQuestionIndices.length} Question
                          {selectedQuestionIndices.length !== 1 ? "s" : ""}
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>

          <CardContent>
            {selectedMatchData ? (
              selectedMatchData.questions.length > 0 ? (
                <div className="space-y-6">
                  {selectedMatchData.questions.map((question: Question) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                          <h3 className="font-medium">{question.text}</h3>
                          <div className="flex space-x-2">
                            <Badge
                              variant={
                                question.status === "answered"
                                  ? "default"
                                  : question.status === "unanswered"
                                  ? "outline"
                                  : "secondary"
                              }
                            >
                              {question.status === "answered"
                                ? `Answered: ${question.answer}`
                                : question.status}
                            </Badge>
                            {question.isActive === false && (
                              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {question.status !== "answered" && (
                        <div className="space-y-4">
                          <RadioGroup
                            value={answers[question.id] || ""}
                            onValueChange={(value) =>
                              handleAnswerChange(
                                question.id,
                                value as "yes" | "no"
                              )
                            }
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="yes"
                                id={`${question.id}-yes`}
                              />
                              <Label htmlFor={`${question.id}-yes`}>Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="no"
                                id={`${question.id}-no`}
                              />
                              <Label htmlFor={`${question.id}-no`}>No</Label>
                            </div>
                          </RadioGroup>

                          <div className="flex space-x-4">
                            <Button
                              onClick={() => handleSubmitAnswer(question.id)}
                              disabled={!answers[question.id] || isAnswering}
                              size="sm"
                            >
                              {isAnswering ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                <>Submit Answer</>
                              )}
                            </Button>
                            
                            <Button
                              onClick={() => handleEndQues(question.id)}
                              disabled={endingQuestions[question.id] || question.isActive === false}
                              size="sm"
                              variant={question.isActive === false ? "outline" : "default"}
                            >
                              {endingQuestions[question.id] ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Ending...
                                </>
                              ) : question.isActive === false ? (
                                <>Question Ended</>
                              ) : (
                                <>End Question</>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No questions added to this match yet.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click &quot;Generate Questions&quot; to add some.
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Select a match from the list to view and manage its questions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}