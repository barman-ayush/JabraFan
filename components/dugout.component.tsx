import { getTeamColor } from "@/utils/helpers";
import { Badge, Users } from "lucide-react";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { PlayerChange, TeamLineup } from "@/utils/types";

const Dugout = ({
  team,
  showAnimation,
}: {
  team: TeamLineup;
  showAnimation: boolean;
}) => {
  return (
    <Fragment>
      <div className="w-full lg:w-1/4">
        <div
          className={`h-full relative overflow-hidden rounded-xl bg-gradient-to-br ${getTeamColor(
            team.team_name,
            "gradient"
          )} border-4 ${getTeamColor(team.team_name, "border")}`}
        >
          <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Team Dugout
            </h3>

            {/* Players in the dugout - these are the ones leaving */}
            <div className="space-y-2">
              {team.changes_from_last_match.map(
                (change: PlayerChange, changeIndex: number) => (
                  <motion.div
                    key={changeIndex}
                    className="p-2 bg-gray-800 bg-opacity-50 rounded-lg"
                    initial={showAnimation ? {} : {}}
                    animate={
                      showAnimation
                        ? {
                            x: -200,
                            opacity: 0,
                            transition: {
                              duration: 1.5,
                              delay: 0.2,
                            },
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center">
                      {/* Player initials in a circle */}
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-red-700 text-white mr-2">
                        {change.player_out.split(' ').map(name => name[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {change.player_out}
                        </p>
                        <div className="mt-1 flex items-center">
                          {/* Red circle icon */}
                          <div className="h-5 w-5 rounded-full bg-red-600 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-white">●</span>
                          </div>
                          <p className="text-xs text-gray-300 ml-2">
                            OUT
                          </p>
                        </div>
                      </div>

                      {/* Red trail for outgoing players */}
                      {showAnimation && (
                        <motion.div
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 origin-left bg-red-500"
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
                            delay: 0.2,
                            times: [0, 0.2, 0.8, 1],
                          }}
                          style={{ width: "150px" }}
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-300 mt-2">
                      {change.reason}
                    </p>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dugout;