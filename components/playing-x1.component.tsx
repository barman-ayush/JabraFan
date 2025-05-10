import { getTeamColor } from "@/utils/helpers";
import { PlayerChange, TeamLineup } from "@/utils/types";
import { Users } from "lucide-react";
import { Fragment } from "react";

const PlayingXI = ({team} : {team : TeamLineup}) => {
  return (
    <Fragment>
      <div>
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-400" />
          Full Playing XI
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {team.projected_xi.map((player: string, playerIndex: number) => {
            const isPlayerIn = team.changes_from_last_match.some(
              (change: PlayerChange) => change.player_in === player
            );

            return (
              <div
                key={playerIndex}
                className={`flex items-center p-2 rounded-lg ${
                  isPlayerIn
                    ? `${getTeamColor(
                        team.team_name,
                        "highlight"
                      )} border border-green-500`
                    : "bg-gray-700"
                }`}
              >
                {/* Player initials in a circle with team color */}
                <div className="h-8 w-8 rounded-full flex items-center justify-center mr-2 bg-red-700 text-white">
                  {player.split(' ').map(name => name[0]).join('')}
                </div>
                <div>
                  <p className="text-sm text-white">{player}</p>
                  {isPlayerIn && (
                    <div className="mt-1 flex items-center">
                      {/* Green circle icon for new players */}
                      <div className="h-4 w-4 rounded-full bg-green-600 border border-white flex items-center justify-center">
                        <span className="text-xs text-white">●</span>
                      </div>
                      <p className="text-xs text-gray-300 ml-1">NEW</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default PlayingXI;