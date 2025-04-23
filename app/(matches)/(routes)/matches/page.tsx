/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2 } from "lucide-react";
import { Match } from "@/utils/types";
import MatchCard from "@/components/match-card.component";

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
        // Sort matches by date (newest first)
        const sortedMatches = [...data].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setMatchesData(sortedMatches);
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
        // Sort ongoing matches by date (newest first)
        return [...onGoingMatches].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      case "completed":
        // Sort completed matches by date (newest first)
        return [...completedMatches].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      case "all":
        // First prioritize live matches, then sort by date (newest first)
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
          return dateB.getTime() - dateA.getTime(); // Changed to put newest first
        });
      default:
        return [...matchesData].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
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
