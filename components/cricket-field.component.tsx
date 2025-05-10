import React, { Fragment, JSX } from "react";
import { motion } from "framer-motion";
import { playerPositions } from "@/data/colors-team-changes";
import { LucideProps } from "lucide-react";
import { TeamLineup } from "@/utils/types";
import { getPlayerIcon, getTeamColor } from "@/utils/helpers";

type CricketGroundProps = {
  team: TeamLineup;
  showAnimation: boolean;
  // getPlayerIcon: (player: string) => JSX.Element;
  // getTeamColor: (
  //   teamName: string,
  //   type:
  //     | "bg"
  //     | "border"
  //     | "text"
  //     | "accent"
  //     | "highlight"
  //     | "light"
  //     | "gradient"
  // ) => string;
};

const CricketGround = ({
  team,
  showAnimation,
}: CricketGroundProps) => {
  return (
    <Fragment>
      <div className="w-full lg:w-3/4 relative">
        <div className="relative h-[500px] overflow-hidden rounded-xl bg-gradient-to-b from-green-800 to-green-900 border-8 border-green-950">
          {/* Oval shape for cricket field */}
          <div className="absolute inset-4 rounded-full border-4 border-white border-opacity-30"></div>

          {/* Pitch in the middle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-80 bg-yellow-700 border border-yellow-600">
            <div className="absolute inset-x-0 top-10 h-1 bg-white"></div>
            <div className="absolute inset-x-0 bottom-10 h-1 bg-white"></div>
          </div>

          {/* 30-yard circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-dashed border-white border-opacity-30"></div>

          {/* Players on field */}
          {team.projected_xi.map((player: string, playerIndex: number) => {
            const isPlayerIn = team.changes_from_last_match.some(
              (change) => change.player_in === player
            );

            return (
              <motion.div
                key={playerIndex}
                className="absolute"
                style={{
                  top: playerPositions[playerIndex].top,
                  left: playerPositions[playerIndex].left,
                }}
                initial={
                  isPlayerIn && showAnimation ? { x: 200, opacity: 0 } : {}
                }
                animate={
                  isPlayerIn && showAnimation
                    ? {
                        x: 0,
                        opacity: 1,
                        transition: { duration: 1.5 },
                      }
                    : {}
                }
              >
                <div
                  className={`relative flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2`}
                >
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${getTeamColor(
                      team.team_name,
                      "bg"
                    )} text-white shadow-lg ring-2 ring-white`}
                  >
                    {getPlayerIcon(player)}
                  </div>
                  <div className="absolute -bottom-7 whitespace-nowrap">
                    <p className="text-xs bg-black bg-opacity-70 text-white px-2 py-1 rounded-full">
                      {player.split(" ")[0]}
                    </p>
                  </div>

                  {/* Green trail for incoming players */}
                  {isPlayerIn && showAnimation && (
                    <motion.div
                      className="absolute right-full top-1/2 transform -translate-y-1/2 h-1 origin-right bg-green-500"
                      initial={{
                        scaleX: 0,
                        opacity: 0,
                      }}
                      animate={{
                        scaleX: 1,
                        opacity: [0, 1, 0.7, 0],
                      }}
                      transition={{
                        duration: 1.2,
                        times: [0, 0.2, 0.8, 1],
                      }}
                      style={{ width: "150px" }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};
export default CricketGround;
