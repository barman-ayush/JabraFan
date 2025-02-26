"use client";

import Questions from "@/components/Questions";
import React from "react";

type MatchPageProps = {
  params: {
    matchId: string;
  };
};

export default function MatchPage({ params }: MatchPageProps) {
  const { matchId } : {matchId : string} = params;
  const [questions, setQuestions] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Fetch match details
    async function getMatch() {
      const res = await fetch(
        `http://localhost:3050/generate-contest?match_id=${matchId}&no_of_questions=${5}`
      );
      if (res.status !== 200) throw new Error("Failed to fetch match");
      return res.json();
    }

    getMatch().then((questions) => {
      setQuestions(questions);
    });
  }, [matchId]);

  return (
    <div className="p-4 space-y-4">
      {questions.map((que, index) => (
        <Questions
          key={index}
          id={index}
          question={que}
          options={["yes", "no"]}
        />
      ))}
    </div>
  );
}
