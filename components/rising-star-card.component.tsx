import {
  IPLTeamName,
  PlayerPerformance,
  TeamRisingPlayer,
} from "@/utils/types";

import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Fragment } from "react";
import { Calendar, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { iplTeamColors } from "@/data/ImageMap";

const RisingStarCard = ({
  RisingPlayer,
  index,
}: {
  RisingPlayer: TeamRisingPlayer;
  index: number;
}) => {
  // Function to determine team color based on new iplTeamColors mapping
  const getTeamColor = (
    teamName: string,
    type: "bg" | "border" | "text" | "accent" | "highlight"
  ) => {
    return (
      iplTeamColors[teamName as IPLTeamName]?.[type] ||
      (type === "bg"
        ? "bg-gray-700"
        : type === "border"
        ? "border-gray-700"
        : type === "text"
        ? "text-gray-400"
        : type === "accent"
        ? "bg-gray-800"
        : "bg-gray-700")
    );
  };

  // Function to get player initials for avatar
  const getPlayerInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  // Function to determine if performance is notable
  const isNotablePerformance = (performance: PlayerPerformance) => {
    return (
      (performance.runs && performance.runs > 40) ||
      (performance.wickets && performance.wickets > 0)
    );
  };

  // Function to render performance metrics
  const renderPerformanceMetrics = (performance: PlayerPerformance) => {
    const metrics = [];

    if (performance.runs) {
      metrics.push(
        <div key="runs" className="flex items-center space-x-1">
          <span className="font-semibold text-white">{performance.runs}</span>
          <span className="text-xs text-gray-300">runs</span>
          {performance.balls && (
            <span className="text-xs text-gray-300">
              ({performance.balls} balls)
            </span>
          )}
        </div>
      );
    }

    if (performance.wickets) {
      metrics.push(
        <div key="wickets" className="flex items-center space-x-1">
          <span className="font-semibold text-white">
            {performance.wickets}
          </span>
          <span className="text-xs text-gray-300">
            wicket{performance.wickets !== 1 ? "s" : ""}
          </span>
        </div>
      );
    }

    if (performance.economy) {
      metrics.push(
        <div key="economy" className="flex items-center space-x-1">
          <span className="font-semibold text-white">
            {performance.economy}
          </span>
          <span className="text-xs text-gray-300">economy</span>
        </div>
      );
    }

    if (metrics.length === 0 && performance.note) {
      metrics.push(
        <div key="note" className="text-sm text-gray-300 italic">
          {performance.note}
        </div>
      );
    } else if (metrics.length === 0) {
      metrics.push(
        <div key="no-data" className="text-sm text-gray-300 italic">
          No performance data available
        </div>
      );
    }

    return metrics;
  };
  return (
    <Fragment>
      <Card
        key={index}
        className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800 border-gray-700 text-white"
      >
        <div
          className={`h-3 w-full ${getTeamColor(RisingPlayer.team, "bg")}`}
          aria-hidden="true"
        />
        <CardHeader className="pb-2 bg-gray-800">
          <div className="flex justify-between items-start">
            <Badge
              variant="outline"
              className={`font-medium border-2 ${getTeamColor(
                RisingPlayer.team,
                "border"
              )} text-xs ${getTeamColor(RisingPlayer.team, "text")}`}
            >
              {RisingPlayer.team}
            </Badge>
            <Badge
              className={`${getTeamColor(RisingPlayer.team, "bg")} text-white`}
            >
              {RisingPlayer.rising_player.role}
            </Badge>
          </div>
          <div className="flex items-center mt-4">
            <Avatar
              className={`h-12 w-12 mr-3 ${getTeamColor(
                RisingPlayer.team,
                "bg"
              )} text-white`}
            >
              <span className="text-sm font-medium">
                {getPlayerInitials(RisingPlayer.rising_player.name)}
              </span>
            </Avatar>
            <CardTitle className="text-xl text-white">
              {RisingPlayer.rising_player.name}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="bg-gray-800">
          <h3 className="font-semibold text-sm mb-2 flex items-center text-white">
            <Calendar className="h-4 w-4 mr-1 text-gray-300" />
            Recent Performances
          </h3>

          <div className="space-y-3">
            {RisingPlayer.rising_player.last_week_performances.map(
              (performance: PlayerPerformance, idx: number) => (
                <div
                  key={idx}
                  className={`rounded-lg p-3 ${
                    isNotablePerformance(performance)
                      ? `${getTeamColor(
                          RisingPlayer.team,
                          "highlight"
                        )} border border-opacity-30 border-${getTeamColor(
                          RisingPlayer.team,
                          "border"
                        ).replace("border-", "")}`
                      : "bg-gray-700 border border-gray-600"
                  }`}
                >
                  <div className="text-sm font-medium mb-1 text-white">
                    {performance.match}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {renderPerformanceMetrics(performance)}
                  </div>

                  {isNotablePerformance(performance) && (
                    <div className="mt-2 flex items-center text-green-300 text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Notable performance
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-4 bg-gray-800">
          <div className="w-full flex justify-end">
            <Badge
              variant="outline"
              className={`text-xs font-normal ${getTeamColor(
                RisingPlayer.team,
                "text"
              )} border-${getTeamColor(RisingPlayer.team, "border").replace(
                "border-",
                ""
              )}`}
            >
              Player to watch
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </Fragment>
  );
};
export default RisingStarCard;
