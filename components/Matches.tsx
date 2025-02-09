"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

type MatchProps = {
  id: number;
  competition: string;
  date: string;
  time: string;
  homeTeam: {
    name: string;
    logo: string;
  };
  awayTeam: {
    name: string;
    logo: string;
  };
  score: {
    home: number;
    away: number;
    homeWickets: number;
    awayWickets: number;
    homeOvers: string;
    awayOvers: string;
  };
}

export default function Match({
  id,
  competition,
  date,
  time,
  homeTeam,
  awayTeam,
  score,
}: MatchProps) {

  const { theme } = useTheme();
  const isDark = theme === "dark" || !theme;
  
  const containerClasses = `max-w-2xl mx-auto rounded-lg bg-gradient-to-b ${
    isDark
      ? "from-slate-800 to-slate-900 text-white p-4 border border-slate-700"
      : "from-sky-50 to-blue-50 text-black p-4 border border-sky-200"
  }`;

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-semibold">{competition}</h1>
        <p className="text-slate-400 text-sm">
          {date} at {time}
        </p>
      </div>

      {/* Match Result */}
      <div className="mt-4 sm:mt-8 flex items-center justify-between px-2 sm:px-4">
        {/* Home Team */}
        <div className="text-center flex-1">
          <div className="relative w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-2 sm:mb-4">
            <Image
              src={homeTeam.logo || "/placeholder.svg"}
              alt={`${homeTeam.name} logo`}
              fill
              className="rounded-full"
            />
          </div>
          <h2 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2">
            {homeTeam.name}
          </h2>
          <div>
            <p className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2">
              {score.home} / {score.homeWickets}
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              {score.homeOvers}
            </p>
          </div>
        </div>

        <div className="text-center self-end flex flex-col justify-between h-32 sm:h-44">
          <p className="text-sm sm:text-xl font-bold">Vs</p>
          <Link
            href={`/matches/${id}`}
            className={`${isDark
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-blue-500 hover:bg-blue-600"
            } text-white font-bold py-1 sm:py-2 px-4 sm:px-6 rounded-full
               transition duration-300 ease-in-out transform hover:scale-105 shadow-lg text-sm sm:text-base`}
          >
            Start Bet
          </Link>
        </div>

        {/* Away Team */}
        <div className="text-center flex-1">
          <div className="relative w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-2 sm:mb-4">
            <Image
              src={awayTeam.logo || "/placeholder.svg"}
              alt={`${awayTeam.name} logo`}
              fill
              className="rounded-full"
            />
          </div>
          <h2 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2">
            {awayTeam.name}
          </h2>
          <div>
            <p className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2">
              {score.away} / {score.awayWickets}
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              {score.awayOvers}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
