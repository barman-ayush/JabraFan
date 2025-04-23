"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Trophy } from "lucide-react";
import Link from "next/link";
import { Match } from "@/utils/types";
import TeamView from "@/components/team-image.component";
import { Completed, Live, Upcoming } from "@/components/custom-badge.component";
export default function MatchCard({ match }: { match: Match }) {
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
            {isCompleted ? <Completed /> : isLive ? <Live /> : <Upcoming />}
          </div>
          <CardDescription className="flex items-center text-pink-200 ml-12">
            <Calendar className="mr-1 h-4 w-4 text-pink-300" />
            {formattedDate} at {formattedTime}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-4 flex-grow flex flex-col">
          <div className="flex justify-between items-center bg-purple-900/50 rounded-lg p-4 shadow-md transition-all duration-300 group-hover:bg-purple-900/70">
            <TeamView teamName={match.team1} />
            <div className="flex flex-col items-center justify-center w-2/12">
              <div className="text-lg font-bold text-pink-300 bg-purple-950 px-3 py-1 rounded-full border border-purple-800 transition-all duration-300 group-hover:border-purple-700">
                VS
              </div>
            </div>
            <TeamView teamName={match.team2} />
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
