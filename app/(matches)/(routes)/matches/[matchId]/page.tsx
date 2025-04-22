/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Questions from "@/components/Questions";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Match, Question, UserCredits } from "@/utils/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchLeaderboard from "@/components/leaderboard-matches.component";
import MatchEarnings from "@/components/match-earning.component";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import MatchCreditsCard from "@/components/match-credist.component";
import { useUserContext } from "@/context/UserContext";
import { teamImageMap } from "../../../../../data/ImageMap";
import {
  InitialScoreFetch,
  MatchLoader,
  RealTimeScoreLoading,
} from "@/components/ErrorTemplates/loader-templates.component";
import MatchNotFound from "@/components/ErrorTemplates/match-not-found.component";
import ShowChanges from "@/components/post-match-changes.component";

export default function MatchPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = React.use(params);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [match, setMatch] = React.useState<Match>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [scoreLoading, setScoreLoading] = React.useState<boolean>(true);
  const [initialFetch, setInitialFetch] = React.useState<boolean>(true);
  const [scoreError, setScoreError] = React.useState<boolean>(false);
  const [liveScoreData, setLiveScoreData] = React.useState<{
    team1?: {
      id?: string;
      name?: string;
      score?: string;
    };
    team2?: {
      id?: string;
      name?: string;
      score?: string;
    };
  }>({});

  // Store previous score data for animation transitions
  const [prevScoreData, setPrevScoreData] = React.useState<{
    team1?: { score?: string };
    team2?: { score?: string };
  }>({});

  // Match Credits function Helpers

  // Match Credits States
  const { userData } = useUserContext();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserCredits = async () => {
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
      setCredits({
        baseCredits: result.data.baseCredits || 0,
        bonusCredits: result.data.bonusCredits || 0,
        totalCredits: result.data.totalCredits || 0,
        answeredQuestions: result.data.answeredQuestions || 0,
        correctAnswers: result.data.correctAnswers || 0,
      });
      setError(null);
    } catch (err) {
      setError("Could not load your credits. Please try again later.");
      console.error("Error fetching user credits:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // FETCH MATCH DATA FEATURE

  // const REFRESH_INTERVAL = 40 * 1000; // 40 seconds

  React.useEffect(() => {
    async function getMatchData() {
      try {
        const response = await fetch(`/api/match/${matchId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch match data");
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching match data:", error);
        return null;
      }
    }

    // async function getLiveScoreData() {
    //   try {
    //     const scoreUrl =
    //       process.env.NEXT_PUBLIC_AI_SERVICE_URL || process.env.AI_SERVICE_URL;

    //     console.log("[URL] : ", scoreUrl);
    //     if (!scoreUrl) {
    //       console.warn("AI_SERVICE_URL is not defined");
    //       throw new Error("Score service URL is not configured");
    //     }

    //     const response = await fetch(`${scoreUrl}live/${matchId}`);
    //     if (!response.ok) {
    //       throw new Error(
    //         `Failed to fetch live score data: ${response.status}`
    //       );
    //     }
    //     const data = await response.json();
    //     console.log("[LIVE SCORE DATA]:", data);
    //     return data;
    //   } catch (error) {
    //     console.error("Error fetching live score data:", error);
    //     setScoreError(true);
    //     return null;
    //   } finally {
    //     setScoreLoading(false);
    //   }
    // }

    // Fetch match data first
    getMatchData()
      .then((matchData) => {
        if (matchData) {
          setMatch(matchData);
          setQuestions(matchData.questions.reverse() || []);

          // Only fetch score if match is live or completed
          const matchDate = new Date(matchData.date);
          const now = new Date();
          if (matchDate <= now) {
            // // Match is either live or completed, fetch score
            // getLiveScoreData()
            //   .then((scoreData) => {
            //     if (scoreData) {
            //       setLiveScoreData(scoreData);
            //       // Set initial data as previous for future animations
            //       setPrevScoreData(scoreData);
            //       setInitialFetch(false);
            //     }
            //   })
            //   .catch(() => {
            //     setScoreError(true);
            //   });
            console.log("LIVE MATCH DATA FEATURE IS DOWN TEMPORARILY")
          } else {
            // Match is upcoming, no need to fetch score
            setScoreLoading(false);
            setInitialFetch(false);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error in data fetching flow:", error);
        setLoading(false);
        setScoreLoading(false);
        setInitialFetch(false);
      });
  }, [matchId]);

  // // Set up auto-refresh for live score data
  // React.useEffect(() => {
  //   if (!match) return;

  //   const matchDate = new Date(match.date);
  //   const now = new Date();
  //   const isMatchLiveOrCompleted = matchDate <= now;

  //   // Only set up auto-refresh if match is live or completed
  //   if (!isMatchLiveOrCompleted) return;

  //   const refreshLiveScore = async () => {
  //     try {
  //       setScoreLoading(true);
  //       const scoreUrl =
  //         process.env.NEXT_PUBLIC_AI_SERVICE_URL || process.env.AI_SERVICE_URL;
  //       if (!scoreUrl) {
  //         throw new Error("Score service URL is not configured");
  //       }

  //       // Store current data as previous before fetching new data
  //       setPrevScoreData(liveScoreData);

  //       const response = await fetch(`${scoreUrl}live/${matchId}`);
  //       if (!response.ok) {
  //         throw new Error(
  //           `Failed to fetch live score data: ${response.status}`
  //         );
  //       }

  //       const data = await response.json();
  //       console.log("[REFRESHED LIVE SCORE]:", data);
  //       setLiveScoreData(data);
  //       setScoreError(false);
  //     } catch (error) {
  //       console.error("Error refreshing live score:", error);
  //       setScoreError(true);
  //     } finally {
  //       setScoreLoading(false);
  //     }
  //   };

  //   // Set up interval for auto-refresh
  //   const intervalId = setInterval(refreshLiveScore, REFRESH_INTERVAL);

  //   // Cleanup interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, [match, matchId, liveScoreData]);

  // // Function to manually refresh score data
  // async function refreshScoreData() {
  //   setScoreLoading(true);
  //   setScoreError(false);

  //   try {
  //     // Store current data as previous before fetching new data
  //     setPrevScoreData(liveScoreData);

  //     const scoreUrl =
  //       process.env.NEXT_PUBLIC_AI_SERVICE_URL || process.env.AI_SERVICE_URL;
  //     if (!scoreUrl) {
  //       throw new Error("Score service URL is not configured");
  //     }

  //     const response = await fetch(`${scoreUrl}live/${matchId}`);
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch live score data: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("[MANUALLY REFRESHED SCORE]:", data);
  //     setLiveScoreData(data);
  //   } catch (error) {
  //     console.error("Error refreshing score data:", error);
  //     setScoreError(true);
  //   } finally {
  //     setScoreLoading(false);
  //   }
  // }

  if (loading) return <MatchLoader />;

  if (!match) return <MatchNotFound />;

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

  // LIVE MATCH DATA FEATURE

  // // Enhanced score display rendering with animations
  // const renderScoreDisplay = (team: "team1" | "team2") => {
  //   // For upcoming matches
  //   if (isUpcoming) {
  //     return null;
  //   }

  //   // Handle initial fetch loading state
  //   if (initialFetch && scoreLoading) return <InitialScoreFetch />;

  //   // Get current and previous scores
  //   const currentScore = liveScoreData[team]?.score;
  //   const previousScore = prevScoreData[team]?.score;
  //   const scoreChanged = currentScore !== previousScore;

  //   // Determine a key for animation (using score or a fallback)
  //   const animationKey = `${team}-${currentScore || "no-score"}-${Date.now()}`;

  //   console.log(
  //     `[RENDER] ${team} score:`,
  //     currentScore,
  //     "previous:",
  //     previousScore,
  //     "changed:",
  //     scoreChanged
  //   );

  //   if (!currentScore) {
  //     return (
  //       <motion.div
  //         className="mt-2 bg-purple-800/30 px-4 py-1 rounded-full text-pink-100/70 font-semibold shadow-md"
  //         initial={{ opacity: 0.7 }}
  //         animate={{ opacity: 1 }}
  //         transition={{ duration: 0.3 }}
  //       >
  //         Yet to bat
  //       </motion.div>
  //     );
  //   }

  //   // When updating, blur the loading indicator but keep old data visible
  //   if (scoreLoading && !initialFetch)
  //     return <RealTimeScoreLoading score={previousScore || currentScore} />;

  //   return (
  //     <ShowChanges
  //       scoreChanged={scoreChanged}
  //       animationKey={animationKey}
  //       currentScore={currentScore}
  //     />
  //   );
  // };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <motion.div
        className="flex items-center mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-purple-800 to-pink-700 p-4 rounded-lg shadow-lg mb-6 text-center animate-pulse">
          <p className="text-white text-lg font-bold flex items-center justify-center">
            <span className="text-2xl mr-2">🎯</span>
            Ready to play? Answer the match questions below & claim your cash
            rewards!
          </p>
        </div>
      </motion.div>
      <div className="mb-6 sticky top-0 z-100" style={{ zIndex: "100000" }}>
        <MatchCreditsCard
          matchId={matchId}
          fetchUserCredits={fetchUserCredits}
          stateArray={[{ credits }, { error }, { isLoading, setIsLoading }]}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-sm bg-purple-950 border border-purple-900">
          <CardHeader className="pb-2 border-b border-purple-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <motion.div
                  className="bg-pink-500/10 p-2 rounded-lg mr-2"
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <Trophy className="h-5 w-5 text-pink-400" />
                </motion.div>
                <CardTitle className="text-pink-100">{match.league}</CardTitle>
              </div>
              {isCompleted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-purple-800 text-pink-100 hover:bg-purple-700"
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Completed
                  </Badge>
                </motion.div>
              ) : isLive ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.9, 1, 0.9],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      repeatType: "reverse",
                    }}
                  >
                    <Badge
                      variant="outline"
                      className="bg-green-900 text-green-300 border-green-700"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      Live
                    </Badge>
                  </motion.div>
                  {/* {!scoreLoading && !scoreError && (isLive || isCompleted) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={refreshScoreData}
                              className="p-0 h-8 w-8 rounded-full bg-purple-800/30 hover:bg-purple-700 text-pink-100"
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Refresh score manually</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )} */}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge
                    variant="outline"
                    className="flex items-center bg-purple-800 text-pink-100 border-purple-700"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    Upcoming
                  </Badge>
                </motion.div>
              )}
            </div>
            <CardDescription className="flex items-center mt-2 text-pink-200">
              <Calendar className="mr-1 h-4 w-4 text-pink-300" />
              {formattedDate} at {formattedTime}
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-purple-900/50">
            <div className="flex justify-center items-center gap-x-8 py-6">
              <motion.div
                className="text-center flex-1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-800 mb-3 bg-white/10 shadow-lg flex items-center justify-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
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
                  </motion.div>
                  <motion.h2
                    className="text-2xl font-bold text-pink-100"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {match.team1}
                  </motion.h2>
                  {/* {renderScoreDisplay("team1")} */}
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <motion.div
                  className="text-xl font-bold text-pink-300 bg-purple-950 rounded-full p-3 border border-purple-800 shadow-md mb-2"
                  animate={{
                    boxShadow: [
                      "0 4px 6px rgba(0, 0, 0, 0.1)",
                      "0 6px 15px rgba(139, 92, 246, 0.3)",
                      "0 4px 6px rgba(0, 0, 0, 0.1)",
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                  }}
                >
                  VS
                </motion.div>
                {scoreError && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                  ></motion.div>
                )}
              </motion.div>

              <motion.div
                className="text-center flex-1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-800 mb-3 bg-white/10 shadow-lg flex items-center justify-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
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
                  </motion.div>
                  <motion.h2
                    className="text-2xl font-bold text-pink-100"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {match.team2}
                  </motion.h2>
                  {/* {renderScoreDisplay("team2")} */}
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
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
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {questions.map((question, index) => (
                    <motion.div
                      key={question.id || index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 },
                      }}
                    >
                      <Card className="shadow-sm">
                        <CardContent className="p-6">
                          <Questions
                            fetchUserCredits={fetchUserCredits}
                            id={index} // Using index for unique ID
                            question={question}
                            options={["yes", "no"]}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
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
      </motion.div>
    </div>
  );
}
