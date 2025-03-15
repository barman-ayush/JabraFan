/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";

export default function Match(match: any) {
  const isMatchLive = match.data.sport_event_status.status === "live";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getTeamScore = (periodScores: any[], isHomeTeam: boolean) => {
    if (!isMatchLive) return { score: "-", wickets: "-", batting: false };

    const firstInnings = periodScores[0];
    const secondInnings = periodScores[1];
    const currentInning = match.data.sport_event_status.current_inning;

    // If first innings is ongoing
    if (!secondInnings) {
      if (isHomeTeam) {
        return {
          score: firstInnings?.home_score ?? 0,
          wickets: firstInnings?.home_wickets ?? 0,
          batting: currentInning === 1 && firstInnings?.home_score > 0,
        };
      }
      return {
        score: firstInnings?.away_score ?? 0,
        wickets: firstInnings?.away_wickets ?? 0,
        batting: currentInning === 1 && firstInnings?.away_score > 0,
      };
    }

    // If second innings
    return isHomeTeam
      ? {
          score: firstInnings?.home_score || secondInnings?.home_score || 0,
          wickets:
            firstInnings?.home_wickets ?? secondInnings?.home_wickets ?? 0,
          batting: currentInning === 2 && secondInnings?.home_score >= 0,
        }
      : {
          score: firstInnings?.away_score || secondInnings?.away_score || 0,
          wickets:
            firstInnings?.away_wickets ?? secondInnings?.away_wickets ?? 0,
          batting: currentInning === 2 && secondInnings?.away_score >= 0,
        };
  };

  const homeTeamScore = getTeamScore(
    match.data.sport_event_status.period_scores,
    true
  );
  const awayTeamScore = getTeamScore(
    match.data.sport_event_status.period_scores,
    false
  );

  return (
    <div className="max-w-2xl mx-auto rounded-lg bg-gradient-to-b from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] p-4 border border-[hsl(var(--border-color))]">
      <div className="text-center">
        <h1 className="text-xl font-semibold">
          {match.data.sport_event.season.name}
        </h1>
        <p className="text-slate-400 text-sm">
          {new Date(match.data.sport_event.scheduled).toLocaleDateString()} at{" "}
          {new Date(match.data.sport_event.scheduled).toLocaleTimeString()}
        </p>
      </div>

      <div className="mt-4 sm:mt-8 flex items-center justify-between px-2 sm:px-4">
        {/* Home Team */}
        <div className="text-center flex-1">
          <div className="relative w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-2 sm:mb-4">
            <Image
              src={
                "https://thumbs.dreamstime.com/z/people-flat-icon-group-round-colorful-button-team-circular-vector-sign-shadow-effect-style-design-92997577.jpg?w=768"
              }
              // src={match.data.sport_event.competitors[0].logo || "/placeholder.svg"}
              alt={`${match.data.sport_event.competitors[0].name} logo`}
              fill
              className="rounded-full"
            />
          </div>
          <h2 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2">
            {match.data.sport_event.competitors[0].name}
          </h2>
          <div>
            <p className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2">
              {homeTeamScore.score}/{homeTeamScore.wickets}
            </p>
          </div>
        </div>

        <div className="text-center self-end flex flex-col justify-between h-32 sm:h-44">
          <p className="text-sm sm:text-xl font-bold">Vs</p>
          {isMatchLive ? (
            <Link
              href={`/matches/${match.data.sport_event.id}`}
              className="bg-[hsl(var(--primary-button))] hover:bg-[hsl(var(--primary-button-hover))] text-white font-bold py-1 sm:py-2 px-4 sm:px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Start Bet
            </Link>
          ) : (
            <div className="bg-gray-400 text-white font-bold py-1 sm:py-2 px-4 sm:px-6 rounded-full text-sm sm:text-base">
              Not yet started
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="text-center flex-1">
          <div className="relative w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-2 sm:mb-4">
            <Image
              src={
                "https://thumbs.dreamstime.com/z/people-flat-icon-group-round-colorful-button-team-circular-vector-sign-shadow-effect-style-design-92997577.jpg?w=768"
              }
              // src={
              //   match.data.sport_event.competitors[1].logo || "/placeholder.svg"
              // }
              alt={`${match.data.sport_event.competitors[1].name} logo`}
              fill
              className="rounded-full"
            />
          </div>
          <h2 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2">
            {match.data.sport_event.competitors[1].name}
          </h2>
          <div>
            <p className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2">
              {awayTeamScore.score}/{awayTeamScore.wickets}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
