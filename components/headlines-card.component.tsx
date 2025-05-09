import { MatchHeadline, performers } from "@/utils/types";
import { Fragment } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { teamColors } from "@/data/ImageMap";
import { CalendarIcon, MapPinIcon } from "lucide-react";

const HeadlinesCard = ({ match }: { match: MatchHeadline }) => {
  // Function to format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US");
  };

  // Function to determine team badge color
  const getTeamColor = (teamName: string) => {
    return teamColors[teamName];
  };
  return (
    <Fragment>
      <Card key={match.match_number} className="overflow-hidden shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className="font-medium">
              Match #{match.match_number}
            </Badge>
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {formatDate(match.date)}
            </div>
          </div>
          <CardTitle className="text-xl">{match.headline}</CardTitle>
          <div className="flex justify-between items-center mt-2">
            <Badge className={`${getTeamColor(match.teams.team1)} text-white`}>
              {match.teams.team1}
            </Badge>
            <div className="text-sm font-medium">VS</div>
            <Badge className={`${getTeamColor(match.teams.team2)} text-white`}>
              {match.teams.team2}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="mb-4">
            <h3 className="font-semibold text-lg text-green-700 mb-2">
              {match.result}
            </h3>
            <p className="text-gray-700">{match.details}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Key Performers</h3>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(match.key_performers).map(
                ([team, performers]) => (
                  <div key={team} className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-2">{team}</h4>
                    <div className="space-y-2">
                      {performers.map(
                        (performer: performers, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 bg-slate-200">
                              <span className="text-xs">
                                {performer.player
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {performer.player}
                              </p>
                              <p className="text-xs text-gray-500">
                                {performer.performance}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="py-3">
          <div className="flex items-center text-sm text-gray-600 w-full">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{match.venue}</span>
          </div>
        </CardFooter>
      </Card>
    </Fragment>
  );
};
export default HeadlinesCard;
