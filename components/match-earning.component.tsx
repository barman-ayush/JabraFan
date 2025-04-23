"use client";

import React, { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Coins,
  Award,
  Trophy,
  Medal,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useUserContext } from "@/context/UserContext";

type UserStats = {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  baseCredits: number;
  bonusCredits: number;
  totalCredits: number;
  userRank: number;
  potentialPrize: number;
  prizeInfo: {
    firstPrize: number;
    secondPrize: number;
    thirdPrize: number;
  };
};

const MatchEarnings = ({
  matchId,
  matchDate,
}: {
  matchId: string;
  matchDate: Date;
}) => {
  const { userData } = useUserContext();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine if match is completed
  const isCompleted = new Date(matchDate) < new Date();

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!userData?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/match/${matchId}/user-stats?userId=${userData.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user statistics");
        }

        const result = await response.json();
        setStats(result.data);
        setError(null);
      } catch (err) {
        setError(
          "Could not load your match statistics. Please try again later."
        );
        console.error("Error fetching user stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData?.id && matchId) {
      fetchUserStats();
    } else {
      setIsLoading(false);
    }
  }, [userData?.id, matchId]);

  // Render appropriate medal based on rank
  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return null;
    }
  };

  if (!userData) {
    return (
      <Fragment>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Your Rewards</h2>
        </div>
        <Card className="shadow-sm w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-amber-500 mb-2" />
            <p className="text-muted-foreground">
              Sign in to view your earnings
            </p>
          </CardContent>
        </Card>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Your Rewards</h2>
      </div>

      <Card className="shadow-sm w-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 text-primary mr-2" />
            Your Match Earnings
          </CardTitle>
          <CardDescription>
            {isCompleted
              ? "Final earnings for this match"
              : "Potential earnings - answer more questions to increase your rewards!"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center p-6 text-red-500">{error}</div>
          ) : !stats ? (
            <div className="text-center p-6 text-muted-foreground">
              No data available.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Credits Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium flex items-center">
                  <Coins className="h-5 w-5 mr-2 text-amber-500" />
                  Credits Earned
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Base Credits
                    </p>
                    <p className="text-2xl font-bold">{stats.baseCredits}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.answeredQuestions} questions × 30
                    </p>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Bonus Credits
                    </p>
                    <p className="text-2xl font-bold">{stats.bonusCredits}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.correctAnswers} correct × 40
                    </p>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <p className="text-sm text-primary mb-1">Total Credits</p>
                    <p className="text-2xl font-bold">{stats.totalCredits}</p>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Progress</span>
                    <span>
                      {stats.answeredQuestions}/{stats.totalQuestions} Questions
                    </span>
                  </div>
                  <Progress
                    value={
                      (stats.answeredQuestions / stats.totalQuestions) * 100
                    }
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.correctAnswers} correct answers (
                    {Math.round(
                      (stats.correctAnswers /
                        Math.max(1, stats.answeredQuestions)) *
                        100
                    )}
                    % accuracy)
                  </p>
                </div>
              </div>

              {/* Rank & Prize Money Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Prize Money
                </h3>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-t-lg border-b">
                    <div className="flex items-center">
                      <div className="w-10 flex justify-center mr-3">
                        {getRankMedal(stats.userRank)}
                      </div>
                      <div>
                        <p className="font-medium">Your Rank</p>
                        <p className="text-sm text-muted-foreground">
                          {stats.userRank <= 3
                            ? "Top 3 finisher - Prize eligible!"
                            : "Keep answering to improve your rank"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-lg font-bold">
                      #{stats.userRank}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 text-center border-b">
                    <div className="p-3 border-r">
                      <div className="flex justify-center mb-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">1st Place</p>
                      <p className="font-bold">₹{stats.prizeInfo.firstPrize}</p>
                    </div>

                    <div className="p-3 border-r">
                      <div className="flex justify-center mb-1">
                        <Medal className="h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-muted-foreground">2nd Place</p>
                      <p className="font-bold">
                        ₹{stats.prizeInfo.secondPrize}
                      </p>
                    </div>

                    <div className="p-3">
                      <div className="flex justify-center mb-1">
                        <Medal className="h-4 w-4 text-amber-700" />
                      </div>
                      <p className="text-xs text-muted-foreground">3rd Place</p>
                      <p className="font-bold">₹{stats.prizeInfo.thirdPrize}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/10 rounded-b-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">Your Potential Prize</p>
                      <p className="text-sm text-muted-foreground">
                        {isCompleted
                          ? "Final prize amount"
                          : "Current projection based on rank"}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      ₹{stats.potentialPrize}
                    </div>
                  </div>
                </div>

                {!isCompleted && stats.userRank > 3 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <p>
                        You&apos;re currently ranked #{stats.userRank}. Answer
                        more questions correctly to reach the top 3 and win
                        prize money!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default MatchEarnings;
