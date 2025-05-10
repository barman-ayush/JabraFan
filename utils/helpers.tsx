import { teamColors } from "@/data/colors-team-changes";
import { Award, Shield, Shirt, Trophy, User } from "lucide-react";

export const getTeamColor = (
  teamName: string,
  type: "bg" | "border" | "text" | "accent" | "highlight" | "light" | "gradient"
) => {
  // Extract team name from format like "Team1 vs Team2"
  const exactTeamName = Object.keys(teamColors).find((team) =>
    teamName.includes(team)
  );

  if (exactTeamName && teamColors[exactTeamName]) {
    return teamColors[exactTeamName][type];
  }

  return type === "bg"
    ? "bg-gray-700"
    : type === "border"
    ? "border-gray-700"
    : type === "text"
    ? "text-gray-400"
    : type === "accent"
    ? "bg-gray-800"
    : type === "light"
    ? "bg-gray-400"
    : type === "gradient"
    ? "from-gray-700 to-gray-800"
    : "bg-gray-700";
};

// Function to get player icon based on role
export const getPlayerIcon = (player: string) => {
  if (player.includes("(c)") && player.includes("(wk)")) {
    return <Shield className="h-5 w-5" />;
  } else if (player.includes("(c)")) {
    return <Award className="h-5 w-5" />;
  } else if (player.includes("(wk)")) {
    return <User className="h-5 w-5" />;
  } else if (
    player.toLowerCase().includes("sharma") ||
    player.toLowerCase().includes("chahal") ||
    player.toLowerCase().includes("siraj") ||
    player.toLowerCase().includes("bumrah") ||
    player.toLowerCase().includes("boult")
  ) {
    return <Trophy className="h-5 w-5" />;
  } else {
    return <Shirt className="h-5 w-5" />;
  }
};
