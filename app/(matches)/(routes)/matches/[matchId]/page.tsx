"use client";

import Questions from "@/components/Questions";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Match, Question } from "@/utils/types";

type MatchPageProps = {
  params: {
    matchId: string;
  };
};

export default function MatchPage({ params }: MatchPageProps) {
  const { matchId } = params;
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [match, setMatch] = React.useState<Match>();
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function getMatchData() {
      const response = await fetch(`/api/match/${matchId}`);
      const data = await response.json();
      return data;
    }

    getMatchData().then((matchData) => {
      if (matchData) {
        setMatch(matchData);
        setQuestions(matchData.questions || []);
      }

      setLoading(false);
    });
  }, [matchId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mx-auto p-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Match Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <p className="text-lg text-muted-foreground">
              The match you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button asChild variant="outline">
              <Link href="/matches" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to matches
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const matchDate = new Date(match.date);
  const isUpcoming = matchDate > new Date();

  const formattedDate = matchDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = matchDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/matches" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to matches
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-primary mr-2" />
              <CardTitle>{match.league}</CardTitle>
            </div>
            {isUpcoming ? (
              <Badge variant="outline" className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                Upcoming
              </Badge>
            ) : (
              <Badge variant="secondary">Completed</Badge>
            )}
          </div>
          <CardDescription className="flex items-center mt-2">
            <Calendar className="mr-1 h-4 w-4" />
            {formattedDate} at {formattedTime}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center gap-x-10 py-6">
            <div className="text-center flex-1">
              <h2 className="text-2xl font-bold">{match.team1}</h2>
            </div>
            <div className="text-xl font-bold text-muted-foreground">vs</div>
            <div className="text-center flex-1">
              <h2 className="text-2xl font-bold">{match.team2}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="text-2xl font-bold">Match Questions</h2>
        <Badge variant="outline" className="text-xs">
          {questions.length} questions
        </Badge>
      </div>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground">
                No questions available for this match
              </p>
            </CardContent>
          </Card>
        ) : (
          questions.map((question, index) => (
            <Card key={question.id || index} className="shadow-sm">
              <CardContent className="p-6">
                <Questions
                  id={index}
                  question={question.text}
                  options={["yes", "no"]}
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}