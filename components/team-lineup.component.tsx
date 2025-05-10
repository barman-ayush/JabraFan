import { Dispatch, Fragment, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap } from "lucide-react";
import { PlayerChange, TeamChangeMatch, TeamLineup } from "@/utils/types";
import CricketGround from "./cricket-field.component";
import Dugout from "./dugout.component";
import PlayingXI from "./playing-x1.component";
import { getTeamColor } from "@/utils/helpers";

type TeamLineupComponentProps = {
  setAnimatingPlayers: Dispatch<
    SetStateAction<{
      in: string[];
      out: string[];
    }>
  >;
  setShowAnimation: Dispatch<SetStateAction<boolean>>;
  showAnimation: boolean;
  match: TeamChangeMatch;
};

const TeamLineupComponent = ({
  setAnimatingPlayers,
  setShowAnimation,
  showAnimation,
  match,
}: TeamLineupComponentProps) => {
  const triggerAnimation = (team: TeamLineup) => {
    // Set the players for animation
    const playersIn = team.changes_from_last_match.map(
      (change: PlayerChange) => change.player_in
    );
    const playersOut = team.changes_from_last_match.map(
      (change: PlayerChange) => change.player_out
    );

    setAnimatingPlayers({ in: playersIn, out: playersOut });
    setShowAnimation(true);

    // Reset animation state after a delay
    setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
  };

  return (
    <Fragment>
      <Tabs defaultValue={match.lineups[0].team_name} className="w-full">
        <TabsList className="w-full bg-gray-700 border-b border-gray-600 rounded-none">
          {match.lineups.map((team: TeamLineup, teamIndex: number) => (
            <TabsTrigger
              key={teamIndex}
              value={team.team_name}
              className={`flex-1 data-[state=active]:${getTeamColor(
                team.team_name,
                "bg"
              )} data-[state=active]:text-white`}
              onClick={() => triggerAnimation(team)}
            >
              {team.team_name}
            </TabsTrigger>
          ))}
        </TabsList>

        {match.lineups.map((team: TeamLineup, teamIndex: number) => (
          <TabsContent key={teamIndex} value={team.team_name} className="p-0">
            <div className="p-4">
              <div className="flex justify-end mb-4">
                <Button
                  className={`${getTeamColor(team.team_name, "bg")} text-white`}
                  onClick={() => triggerAnimation(team)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Replay Transfers
                </Button>
              </div>

              {/* Cricket Ground Layout */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <CricketGround team={team} showAnimation={showAnimation} />
                <Dugout showAnimation={showAnimation} team={team} />
              </div>

              {/* Playing XI List */}
              <PlayingXI team={team} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Fragment>
  );
};
export default TeamLineupComponent;
