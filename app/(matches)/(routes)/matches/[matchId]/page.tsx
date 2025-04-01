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
import {
  Calendar,
  Clock,
  Trophy,
  ArrowLeft,
  Users,
  Gift,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Match, Question } from "@/utils/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchLeaderboard from "@/components/leaderboard-matches.component";
import MatchEarnings from "@/components/match-earning.component";
import Image from "next/image";

const teamImageMap: Record<string, string> = {
  "Mumbai Indians": "/images/MI.png",
  "Chennai Super Kings": "/images/CSK.png",
  "Royal Challengers Bengaluru": "/images/RCB.png",
  "Kolkata Knight Riders": "/images/KKR.png",
  "Delhi Capitals": "/images/DC.jpg",
  "Sunrisers Hyderabad": "/images/SRH.png",
  "Punjab Kings": "/images/PBKS.png",
  "Rajasthan Royals": "/images/RR.png",
  "Gujarat Titans": "/images/GT.png",
  "Lucknow Super Giants": "/images/LSG.png",
};

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

    getMatchData().then((matchData : any) => {
      if (matchData) {
        setMatch(matchData);
        setQuestions(matchData.questions.reverse() || []);
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

      <Card className="shadow-sm bg-purple-950 border border-purple-900">
        <CardHeader className="pb-2 border-b border-purple-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-pink-500/10 p-2 rounded-lg mr-2">
                <Trophy className="h-5 w-5 text-pink-400" />
              </div>
              <CardTitle className="text-pink-100">{match.league}</CardTitle>
            </div>
            {isCompleted ? (
              <Badge
                variant="secondary"
                className="bg-purple-800 text-pink-100 hover:bg-purple-700"
              >
                <CheckCircle className="mr-1 h-3 w-3" />
                Completed
              </Badge>
            ) : isLive ? (
              <Badge
                variant="outline"
                className="bg-green-900 text-green-300 border-green-700 animate-pulse"
              >
                <Clock className="mr-1 h-3 w-3" />
                Live
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="flex items-center bg-purple-800 text-pink-100 border-purple-700"
              >
                <Clock className="mr-1 h-3 w-3" />
                Upcoming
              </Badge>
            )}
          </div>
          <CardDescription className="flex items-center mt-2 text-pink-200">
            <Calendar className="mr-1 h-4 w-4 text-pink-300" />
            {formattedDate} at {formattedTime}
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-purple-900/50">
          <div className="flex justify-center items-center gap-x-8 py-6">
            <div className="text-center flex-1">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-800 mb-3 bg-white/10 shadow-lg flex items-center justify-center">
                  {teamImageMap[match.team1] ? (
                    <Image
                      src={teamImageMap[match.team1]}
                      alt={match.team1}
                      width={96}
                      height={96}
                      className="object-contain p-2"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {match.team1.substring(0, 2)}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-pink-100">
                  {match.team1}
                </h2>
              </div>
            </div>

            <div className="text-xl font-bold text-pink-300 bg-purple-950 rounded-full p-3 border border-purple-800 shadow-md">
              VS
            </div>

            <div className="text-center flex-1">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-800 mb-3 bg-white/10 shadow-lg flex items-center justify-center">
                  {teamImageMap[match.team2] ? (
                    <Image
                      src={teamImageMap[match.team2]}
                      alt={match.team2}
                      width={96}
                      height={96}
                      className="object-contain p-2"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {match.team2.substring(0, 2)}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-pink-100">
                  {match.team2}
                </h2>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questions" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex items-center">
            <Gift className="h-4 w-4 mr-2" />
            Rewards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Match Predictions</h2>
            <Badge variant="outline" className="text-xs">
              {questions.length} predictions
            </Badge>
          </div>

          <div className="space-y-4">
            {questions.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="p-10 text-center">
                  <p className="text-muted-foreground">
                    No predictions available for this match
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
            <h2 className="text-2xl font-bold">Your Rewards</h2>
          </div>

          <MatchEarnings matchId={matchId} matchDate={matchDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
