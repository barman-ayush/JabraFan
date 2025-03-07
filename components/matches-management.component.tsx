"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { matchesData } from "@/data/matches"
import { availableQuestionsData } from "@/data/questions"

export function MatchesManagement() {
  const [matches, setMatches] = useState(matchesData)
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, "yes" | "no" | null>>({})

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatch(matchId)

    // Initialize answers for this match's questions if not already done
    const match = matches.find((m) => m.id === matchId)
    if (match) {
      const newAnswers = { ...answers }
      match.questions.forEach((q) => {
        if (!newAnswers[q.id]) {
          newAnswers[q.id] = null
        }
      })
      setAnswers(newAnswers)
    }
  }

  const handleAnswerChange = (questionId: string, answer: "yes" | "no") => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleSubmitAnswer = (questionId: string) => {
    const answer = answers[questionId]
    if (answer) {
      // In a real app, you would send this to your API
      console.log(`Submitting answer for question ${questionId}: ${answer}`)

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
                  }
                }
                return q
              }),
            }
          }
          return match
        }),
      )
    }
  }

  const handleCheckQuestion = (questionId: string) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId)
      } else {
        return [...prev, questionId]
      }
    })
  }

  const handleAddQuestions = () => {
    if (selectedMatch && selectedQuestions.length > 0) {
      // Add the selected questions to the match
      setMatches((prev) =>
        prev.map((match) => {
          if (match.id === selectedMatch) {
            const newQuestions = selectedQuestions.map((qId) => {
              const question = availableQuestionsData.find((q) => q.id === qId)
              return {
                id: qId,
                text: question?.text || "",
                status: "pending",
                answer: null,
              }
            })

            return {
              ...match,
              questions: [...match.questions, ...newQuestions],
            }
          }
          return match
        }),
      )

      // Reset selected questions
      setSelectedQuestions([])
    }
  }

  const selectedMatchData = selectedMatch ? matches.find((m) => m.id === selectedMatch) : null

  return (
    <div className="space-y-6 mx-3 md:mt-20 md:mx-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 overflow-hidden">
          <CardHeader>
            <CardTitle>Current Matches</CardTitle>
            <CardDescription>Select a match to manage its questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {matches.map((match) => (
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
                    <span className="text-xs text-muted-foreground">{match.date}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {selectedMatchData ? `${selectedMatchData.team1} vs ${selectedMatchData.team2}` : "Select a Match"}
              </CardTitle>
              <CardDescription>
                {selectedMatchData ? selectedMatchData.date : "Click on a match to view and manage its questions"}
              </CardDescription>
            </div>

            {selectedMatchData && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Generate Questions
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add Questions to Match</DialogTitle>
                    <DialogDescription>
                      Select questions to add to this match. These will be available for users to predict.
                    </DialogDescription>
                  </DialogHeader>

                  <ScrollArea className="h-[300px] mt-4">
                    <div className="space-y-4">
                      {availableQuestionsData.map((question) => (
                        <div key={question.id} className="flex items-start space-x-3 py-2">
                          <Checkbox
                            id={question.id}
                            checked={selectedQuestions.includes(question.id)}
                            onCheckedChange={() => handleCheckQuestion(question.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor={question.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {question.text}
                            </Label>
                            <p className="text-xs text-muted-foreground">{question.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setSelectedQuestions([])}>
                      Clear
                    </Button>
                    <Button onClick={handleAddQuestions} disabled={selectedQuestions.length === 0}>
                      Add {selectedQuestions.length} Question{selectedQuestions.length !== 1 ? "s" : ""}
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
                  {selectedMatchData.questions.map((question) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                          <h3 className="font-medium">{question.text}</h3>
                          <Badge
                            variant={
                              question.status === "answered"
                                ? "default"
                                : question.status === "pending"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {question.status === "answered" ? `Answered: ${question.answer}` : question.status}
                          </Badge>
                        </div>
                      </div>

                      {question.status !== "answered" && (
                        <div className="space-y-4">
                          <RadioGroup
                            value={answers[question.id] || ""}
                            onValueChange={(value) => handleAnswerChange(question.id, value as "yes" | "no")}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                              <Label htmlFor={`${question.id}-yes`}>Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id={`${question.id}-no`} />
                              <Label htmlFor={`${question.id}-no`}>No</Label>
                            </div>
                          </RadioGroup>

                          <Button
                            onClick={() => handleSubmitAnswer(question.id)}
                            disabled={!answers[question.id]}
                            size="sm"
                          >
                            Submit Answer
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No questions added to this match yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Click "Generate Questions" to add some.</p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Select a match from the list to view and manage its questions.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

