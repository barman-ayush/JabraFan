/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, AlertCircle, Loader2 } from "lucide-react";
import { useUserContext } from "@/context/UserContext";
import { motion } from "framer-motion";
import { UserCredits } from "@/utils/types";

type CreditsState = {
  credits: UserCredits | null;
};

type ErrorState = {
  error: string | null;
};

type LoadingState = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type MatchCreditsProps = {
  matchId: string;
  fetchUserCredits: () => {};
  stateArray: [CreditsState, ErrorState, LoadingState];
};

const MatchCreditsCard = ({
  matchId,
  fetchUserCredits,
  stateArray,
}: MatchCreditsProps) => {
  const { userData } = useUserContext();
  const [{ credits }, { error }, { isLoading, setIsLoading }] = stateArray;

  useEffect(() => {
    if (userData?.id && matchId) {
      fetchUserCredits();
    } else {
      setIsLoading(false);
    }
  }, [userData?.id, matchId]);

  if (!userData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-purple-950 border border-purple-800 shadow-md">
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-6 w-6 mx-auto text-amber-500 mb-2" />
            <p className="text-pink-200">Sign in to view your credits</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-purple-950 border border-purple-800 shadow-md">
          <CardContent className="p-4 flex justify-center items-center">
            <Loader2 className="h-5 w-5 animate-spin text-pink-300 mr-2" />
            <span className="text-pink-200">Loading credits...</span>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-purple-950 border border-purple-800 shadow-md">
          <CardContent className="p-4 text-center text-red-300">
            <AlertCircle className="h-5 w-5 mx-auto mb-1" />
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!credits) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-purple-950 border border-purple-800 shadow-md">
          <CardContent className="p-4 text-center">
            <p className="text-pink-200 text-sm">No credits data available</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-purple-950 border border-purple-800 shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b border-purple-800 flex items-center">
            <Coins className="h-5 w-5 text-amber-400 mr-2" />
            <span className="text-pink-100 font-medium">
              Your Cricket Coins
            </span>
          </div>

          <div className="grid grid-cols-3 divide-x divide-purple-800">
            <motion.div
              className="p-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-xs text-pink-300 mb-1">
                🎯 You Played, You Earned! Active Fan Coins
              </p>
              <p className="text-lg font-bold text-pink-100">
                {credits.baseCredits}
              </p>
              <p className="text-xs text-pink-400/70">
                {credits.answeredQuestions} questions × 30
              </p>
            </motion.div>

            <motion.div
              className="p-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs text-pink-300 mb-1">
                💡 Your Cricket Mind Pays Off ! Prediction Coins
              </p>
              <p className="text-lg font-bold text-pink-100">
                {credits.bonusCredits}
              </p>
              <p className="text-xs text-pink-400/70">
                {credits.correctAnswers} correct × 40
              </p>
            </motion.div>

            <motion.div
              className="p-3 text-center bg-gradient-to-r from-purple-900 to-purple-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs text-pink-200 mb-1">
                🪙 Total Cricket Coin
              </p>
              <motion.p
                className="text-xl font-bold text-pink-100"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.4,
                  type: "spring",
                  stiffness: 300,
                }}
              >
                {credits.totalCredits}
              </motion.p>
              <p className="text-xs text-pink-300">
                {Math.round(
                  (credits.correctAnswers /
                    Math.max(1, credits.answeredQuestions)) *
                    100
                )}
                % accuracy
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MatchCreditsCard;
