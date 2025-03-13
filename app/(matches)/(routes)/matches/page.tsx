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
import { Calendar, Clock, Trophy, AlertCircle, BarChart3, Loader2 } from "lucide-react";
import Link from "next/link";
import { Match, Question } from "@/utils/types";

export default function Page() {
  const [isFetching, setIsFetching] = useState(true)
  const [filter, setFilter] = useState("all");
  const [matchesData, setMatchesData] = useState<Match[]>([]);


  React.useEffect(() => {
    // Fetch matches data
    fetch("/api/matches")
      .then((res) => res.json())
      .then((data) =>{
        console.log("FETCHED")
        setMatchesData(data)
        setIsFetching(false);
      });
  }, []);

  const today = new Date();
  console.log("[ MATCH_DATA ] : " , matchesData);

  const onGoingMatches = matchesData.filter((match) => {
    return !(match.isCompleted);
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

        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All Matches</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isFetching ? 
          <>
          <Card className="p-8 text-center md:col-span-2 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Loading matches...</p>
          </Card>
        </>
        : 
        
        getFilteredMatches().length === 0 ? (
          <Card className="p-8 text-center md:col-span-2">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg">No matches found</p>
          </Card>
        ) : (
          getFilteredMatches().map((match) => (
            <MatchCard key={match.id} match={match as Match} />
          ))
        )
        
        }
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  const today = new Date();
  const matchDate = new Date(match.date);
  const isOnGoing = matchDate > today;

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
    "Royal Challengers Bangalore": "bg-red-100 text-red-800",
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

  // const getTeamAbbr = (teamName: string): string => {
  //   return teamName
  //     .split(" ")
  //     .map((word: string) => word[0])
  //     .join("")
  //     .toUpperCase();
  // };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="bg-muted/50 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{match.league}</CardTitle>
          </div>
          {isOnGoing ? (
            <Badge variant="outline" className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              Ongoing
            </Badge>
          ) : (
            <Badge variant="secondary">Completed</Badge>
          )}
        </div>
        <CardDescription className="flex items-center">
          <Calendar className="mr-1 h-4 w-4" />
          {formattedDate} at {formattedTime}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 flex-grow flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center text-center w-5/12">
            <div
              className={`w-12 h-12 ${getTeamColor(
                match.team1
              )} rounded-full flex items-center justify-center mb-2`}
            >
              {match.team1}
            </div>
            <h3 className="font-semibold text-sm">{match.team1}</h3>
          </div>

          <div className="flex flex-col items-center justify-center w-2/12">
            <div className="text-lg font-bold">VS</div>
          </div>

          <div className="flex flex-col items-center text-center w-5/12">
            <div
              className={`w-12 h-12 ${getTeamColor(
                match.team2
              )} rounded-full flex items-center justify-center mb-2`}
            >
              {match.team2}
            </div>
            <h3 className="font-semibold text-sm">{match.team2}</h3>
          </div>
        </div>

        {match.questions.length > 0 && (
          <div className="mt-auto">
            <Separator className="my-4" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium flex items-center text-sm">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Match Questions
                </h4>
                <Badge variant="outline" className="text-xs">
                  {answeredCount}/{totalQuestions} answered
                </Badge>
              </div>

              <div className="w-full">
                <Link
                  href={`/matches/${match.id}`}
                  className="flex items-center justify-between p-4 text-sm font-medium border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <span>View All Questions</span>
                  <span className="text-primary">→</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
