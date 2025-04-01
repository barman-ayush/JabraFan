/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Trophy,
  AlertCircle,
  BarChart3,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Match, Question } from "@/utils/types";
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

export default function Page() {
  const [isFetching, setIsFetching] = useState(true);
  const [filter, setFilter] = useState("ongoing");
  const [matchesData, setMatchesData] = useState<Match[]>([]);

  React.useEffect(() => {
    // Fetch matches data
    fetch("/api/matches")
      .then((res) => res.json())
      .then((data) => {
        console.log("FETCHED");
        setMatchesData(data.reverse());
        setIsFetching(false);
      });
  }, []);

  console.log("[ MATCH_DATA ] : ", matchesData);

  const onGoingMatches = matchesData.filter((match) => {
    return !match.isCompleted;
  });

  const completedMatches = matchesData.filter((match) => {
    return match.isCompleted;
  });

  const totalQuestions = matchesData.reduce(
    (acc, match) => acc + match.questions.length,
    0
  );

  const answeredQuestions = matchesData.reduce((acc, match) => {
    return acc + match.questions.filter((q) => q.status === "answered").length;
  }, 0);

  const getFilteredMatches = () => {
    switch (filter) {
      case "ongoing":
        return onGoingMatches;
      case "completed":
        return completedMatches;
      case "all":
        // Sort all matches to show live matches first
        return [...matchesData].sort((a, b) => {
          const now = new Date();
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          // Check if match A is live (not completed and date is in the past or present)
          const isLiveA = !a.isCompleted && dateA <= now;
          // Check if match B is live (not completed and date is in the past or present)
          const isLiveB = !b.isCompleted && dateB <= now;

          if (isLiveA && !isLiveB) return -1; // A is live, B is not -> A comes first
          if (!isLiveA && isLiveB) return 1; // B is live, A is not -> B comes first

          // If both are live or both are not live, sort by date (most recent first)
          return dateA.getTime() - dateB.getTime();
        });
      default:
        return matchesData;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Matches</h1>
          <p className="text-muted-foreground">
            {totalQuestions} questions ({answeredQuestions} answered)
          </p>
        </div>

        <Tabs defaultValue="ongoing" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All Matches</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="bg-gradient-to-r from-purple-800 to-pink-700 p-4 rounded-lg shadow-lg mb-6 text-center animate-pulse">
        <p className="text-white text-lg font-bold flex items-center justify-center">
          <span className="text-2xl mr-2">🎯</span>
          Ready to play? Answer the match questions below & claim your cash
          rewards!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isFetching ? (
          <>
            <Card className="p-8 text-center md:col-span-2 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium">Loading matches...</p>
            </Card>
          </>
        ) : getFilteredMatches().length === 0 ? (
          <Card className="p-8 text-center md:col-span-2">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg">No matches found</p>
          </Card>
        ) : (
          getFilteredMatches().map((match) => (
            <MatchCard key={match.id} match={match as Match} />
          ))
        )}
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  const now = new Date();
  const matchDate = new Date(match.date);

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

  const answeredCount = match.questions.filter(
    (q: Question) => q.status === "answered"
  ).length;
  const totalQuestions = match.questions.length;

  const teamColors: Record<string, string> = {
    "Mumbai Indians": "bg-blue-100 text-blue-800",
    "Chennai Super Kings": "bg-yellow-100 text-yellow-800",
    "Royal Challengers Bangaluru": "bg-red-100 text-red-800",
    "Kolkata Knight Riders": "bg-purple-100 text-purple-800",
    "Delhi Capitals": "bg-blue-100 text-blue-800",
    "Sunrisers Hyderabad": "bg-orange-100 text-orange-800",
    "Punjab Kings": "bg-red-100 text-red-800",
    "Rajasthan Royals": "bg-pink-100 text-pink-800",
    "Gujarat Titans": "bg-teal-100 text-teal-800",
    "Lucknow Super Giants": "bg-green-100 text-green-800",
  };

  const getTeamColor = (teamName: string): string => {
    return teamColors[teamName] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="group h-full transition-all duration-300 hover:translate-x-1 px-0 py-5">
      <Card className="overflow-hidden h-full flex flex-col bg-purple-950 border border-purple-900 shadow-md transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-purple-900/80 pb-2 border-b border-purple-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-pink-500/10 p-2 rounded-lg group-hover:bg-pink-500/20 transition-all duration-300">
                <Trophy className="h-5 w-5 text-pink-400 group-hover:text-pink-300" />
              </div>
              <CardTitle className="text-lg font-bold text-pink-100">
                {match.league}
              </CardTitle>
            </div>

            {/* Dynamic match status badge */}
            {isCompleted ? (
              <Badge
                variant="secondary"
                className="bg-purple-800 text-pink-100 hover:bg-purple-700"
              >
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
          <CardDescription className="flex items-center text-pink-200 ml-12">
            <Calendar className="mr-1 h-4 w-4 text-pink-300" />
            {formattedDate} at {formattedTime}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-4 flex-grow flex flex-col">
          <div className="flex justify-between items-center bg-purple-900/50 rounded-lg p-4 shadow-md transition-all duration-300 group-hover:bg-purple-900/70">
            <div className="flex flex-col items-center text-center w-5/12">
              <div
                className={`w-16 h-16 ${getTeamColor(
                  match.team1
                )} rounded-full flex items-center justify-center mb-2 shadow-md transition-all duration-300 group-hover:shadow-lg overflow-hidden border-2 border-purple-800`}
              >
                {teamImageMap[match.team1] ? (
                  <Image
                    src={teamImageMap[match.team1]}
                    alt={match.team1}
                    width={64}
                    height={64}
                    className="object-contain p-1"
                  />
                ) : (
                  match.team1.substring(0, 2)
                )}
              </div>
              <h3 className="font-semibold text-sm text-pink-100">
                {match.team1}
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center w-2/12">
              <div className="text-lg font-bold text-pink-300 bg-purple-950 px-3 py-1 rounded-full border border-purple-800 transition-all duration-300 group-hover:border-purple-700">
                VS
              </div>
            </div>

            <div className="flex flex-col items-center text-center w-5/12">
              <div
                className={`w-16 h-16 ${getTeamColor(
                  match.team2
                )} rounded-full flex items-center justify-center mb-2 shadow-md transition-all duration-300 group-hover:shadow-lg overflow-hidden border-2 border-purple-800`}
              >
                {teamImageMap[match.team2] ? (
                  <Image
                    src={teamImageMap[match.team2]}
                    alt={match.team2}
                    width={64}
                    height={64}
                    className="object-contain p-1"
                  />
                ) : (
                  match.team2.substring(0, 2)
                )}
              </div>
              <h3 className="font-semibold text-sm text-pink-100">
                {match.team2}
              </h3>
            </div>
          </div>

          {match.questions.length > 0 && (
            <div className="mt-auto pt-4">
              <Separator className="my-4 bg-purple-800" />
              <div>
                <div className="w-full pl-0">
                  <Link
                    href={`/matches/${match.id}`}
                    className="flex items-center justify-between p-4 text-sm font-medium border border-purple-800 rounded-md bg-purple-900/50 hover:bg-purple-800 transition-all duration-300 group-hover:border-purple-700"
                  >
                    <span className="font-bold">VIEW QUESTIONS</span>
                    <span className="text-pink-300 font-bold group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
