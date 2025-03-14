"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Clock, CheckCircle, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/context/UserContext";

type LeaderboardEntry = {
  userId: string;
  name: string;
  points: number;
};

const MatchLeaderboard = ({ matchId, matchDate }: { matchId: string, matchDate: Date }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userData } = useUserContext();

  // Determine if match is completed or ongoing based on date
  const isCompleted = new Date(matchDate) < new Date();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/match/${matchId}/leaderboard`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        
        const data = await response.json();
        setLeaderboard(data);
        setError(null);
      } catch (err) {
        setError('Could not load leaderboard. Please try again later.');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (matchId) {
      fetchLeaderboard();
    }
  }, [matchId]);

  // Helper function to get medal for position
  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0: // Gold
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1: // Silver
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2: // Bronze
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };

  // Helper function to get row style for position and current user
  const getRowStyle = (position: number, userId: string) => {
    // Safe comparison to handle potential type differences
    const isCurrentUser = userData?.id && userId && userData.id.toString() === userId.toString();
    
    // Base style for position
    let baseStyle = "";
    switch (position) {
      case 0:
        baseStyle = "bg-yellow-100 border-l-4 border-yellow-500 text-gray-900";
        break;
      case 1:
        baseStyle = "bg-gray-100 border-l-4 border-gray-400 text-gray-900";
        break;
      case 2:
        baseStyle = "bg-amber-100 border-l-4 border-amber-700 text-gray-900";
        break;
      default:
        baseStyle = "bg-white text-gray-900";
    }
    
    // Add highlight for current user
    if (isCurrentUser) {
      return `${baseStyle} outline outline-2 outline-blue-500`;
    }
    
    return baseStyle;
  };

  return (
    <Card className="shadow-sm w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 text-primary mr-2" />
            Match Leaderboard
          </CardTitle>
          
          {/* {isCompleted ? (
            <Badge variant="secondary" className="flex items-center">
              <CheckCircle className="mr-1 h-3 w-3" />
              Completed
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              In Progress
            </Badge>
          )} */}
        </div>
        <CardDescription>
          {isCompleted 
            ? "Final standings for this match" 
            : "Current standings - updates as players answer questions"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          // Loading skeletons
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center p-3 rounded-md">
                <Skeleton className="h-6 w-6 rounded-full mr-2" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16 ml-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center p-6 text-red-500">{error}</div>
        ) : leaderboard.length === 0 ? (
          // Empty state
          <div className="text-center p-6 text-muted-foreground">
            No data available yet. Check back after players start answering questions!
          </div>
        ) : (
          // Leaderboard table
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b bg-gray-100">
                  <th className="py-2 px-4 font-semibold text-gray-700 w-16">Rank</th>
                  <th className="py-2 px-4 font-semibold text-gray-700">Player</th>
                  <th className="py-2 px-4 font-semibold text-gray-700 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr 
                    key={entry.userId} 
                    className={`${getRowStyle(index, entry.userId)} transition-colors border-b`}
                  >
                    <td className="py-3 px-4 flex items-center">
                      <span className="font-medium mr-2 text-gray-900">{index + 1}</span>
                      {getMedalIcon(index)}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {entry.name}
                      {userData?.id && entry.userId && userData.id.toString() === entry.userId.toString() && (
                        <Badge variant="outline" className="ml-2 bg-blue-50 border-blue-200 text-blue-700">
                          <User className="h-3 w-3 mr-1" />
                          You
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">
                      {entry.points} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchLeaderboard;