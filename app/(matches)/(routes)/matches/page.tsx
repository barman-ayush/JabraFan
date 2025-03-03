"use client";
import Matches from "@/components/Matches";
import React from "react";
import { SportEvent, MatchResponse } from "@/utils/types";

export default function Page() {
  const [matches, setMatches] = React.useState<MatchResponse[]>([]);

  React.useEffect(() => {
    // Fetch matches
    async function getMatches() {
      const res = await fetch("http://localhost:3050/daily-live-schedule");
      const matchList = await res.json();
      if (matchList.status !== 200) throw new Error("Failed to fetch matches");
      const liveMatches = matchList.data.sport_events.filter(
        (match: SportEvent) => match.status === "live"
      );
      const notLiveMatches = matchList.data.sport_events.filter(
        (match: SportEvent) => match.status !== "live"
      );

      const result = [];

      const matches = await Promise.all(
        liveMatches.map(async (match: SportEvent) => {
          const response = await fetch(
            `http://localhost:3050/match-info/${match.id}`
          );
          const data = await response.json();
          return data;
        })
      );
      result.push(...matches);

      const matchesNotLive = await Promise.all(
        notLiveMatches.map(async (match: SportEvent) => {
          const response = await fetch(
            `http://localhost:3050/match-info/${match.id}`
          );
          const data = await response.json();
          return data;
        })
      );
      result.push(...matchesNotLive);

      return result;
    }

    getMatches().then((matches) => {
      setMatches(matches);
    });
  }, []);

  return (
    <div className="p-4 space-y-4">
      {matches.map((match) => {
        if (match.status === 200) {
          console.log(match);
          return <Matches key={match.data.sport_event.id} {...match} />;
        }
      })}
    </div>
  );
}
