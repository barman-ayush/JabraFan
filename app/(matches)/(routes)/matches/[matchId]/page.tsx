/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Calendar, Clock, Trophy, ArrowLeft, Users, Coins, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Match, Question } from "@/utils/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchLeaderboard from "@/components/leaderboard-matches.component";
import MatchEarnings from "@/components/match-earning.component";

export default function MatchPage({ params }: { params: any }) {
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
  const now = new Date();
  
  // Determine match status based on data
  const isUpcoming = matchDate > now;
  const isLive = !match.isCompleted && !isUpcoming;
  const isCompleted = match.isCompleted;

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
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
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
            {isCompleted ? (
              <Badge variant="secondary" className="flex items-center">
                <CheckCircle className="mr-1 h-3 w-3" />
                Completed
              </Badge>
            ) : isLive ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Clock className="mr-1 h-3 w-3" />
                Live
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                Upcoming
              </Badge>
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

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questions" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Questions
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex items-center">
            <Coins className="h-4 w-4 mr-2" />
            Earnings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="questions" className="mt-4">
          <div className="flex items-center justify-between mb-4">
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
                      id={index} // Using index for unique ID
                      question={question}
                      options={["yes", "no"]}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Match Standings</h2>
          </div>
          
          <MatchLeaderboard matchId={matchId} matchDate={matchDate} />
        </TabsContent>
        
        <TabsContent value="earnings" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Earnings</h2>
          </div>
          
          <MatchEarnings matchId={matchId} matchDate={matchDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}