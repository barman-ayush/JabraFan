"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Users,
  Calendar as CalendarIcon,
  MapPin,
  User,
  Shield,
  Shirt,
  Award,
  Zap,
  Trophy,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { MatchDay, MatchLineupData, TeamLineup } from "@/utils/types";
import { playerPositions, teamColors } from "@/data/colors-team-changes";

const CricketFieldLineups = () => {
  const [matchData, setMatchData] = useState<MatchDay[]>([]);
  const [filteredData, setFilteredData] = useState<MatchDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [animatingPlayers, setAnimatingPlayers] = useState<{
    in: string[];
    out: string[];
  }>({ in: [], out: [] });
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // This is where you would normally fetch the data from an API
    // For now, we'll use the sample data provided
    const sampleData: MatchLineupData = {
      ipl_match_lineups_and_changes: [
        {
          date: "May 10, 2025",
          matches: [
            {
              match_number: 59,
              teams: "Royal Challengers Bangalore vs Gujarat Titans",
              venue: "M. Chinnaswamy Stadium, Bengaluru",
              lineups: [
                {
                  team_name: "Royal Challengers Bangalore",
                  projected_xi: [
                    "Virat Kohli",
                    "Faf du Plessis (c)",
                    "Glenn Maxwell",
                    "Mahipal Lomror",
                    "Cameron Green",
                    "Dinesh Karthik (wk)",
                    "Suyash Prabhudessai",
                    "Karn Sharma",
                    "Mohammed Siraj",
                    "Lockie Ferguson",
                    "Yash Dayal",
                  ],
                  changes_from_last_match: [
                    {
                      player_in: "Suyash Prabhudessai",
                      player_out: "Rajat Patidar",
                      reason: "Tactical change to strengthen the middle order.",
                    },
                  ],
                },
                {
                  team_name: "Gujarat Titans",
                  projected_xi: [
                    "Shubman Gill (c)",
                    "Wriddhiman Saha (wk)",
                    "Sai Sudharsan",
                    "Vijay Shankar",
                    "David Miller",
                    "Rahul Tewatia",
                    "Rashid Khan",
                    "Noor Ahmad",
                    "Mohit Sharma",
                    "Umesh Yadav",
                    "Spencer Johnson",
                  ],
                  changes_from_last_match: [
                    {
                      player_in: "Spencer Johnson",
                      player_out: "Azmatullah Omarzai",
                      reason: "Looking for more pace in the bowling attack.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          date: "May 11, 2025",
          matches: [
            {
              match_number: 60,
              teams: "Chennai Super Kings vs Rajasthan Royals",
              venue: "MA Chidambaram Stadium, Chennai",
              lineups: [
                {
                  team_name: "Chennai Super Kings",
                  projected_xi: [
                    "Ruturaj Gaikwad",
                    "Ajinkya Rahane",
                    "Shivam Dube",
                    "Moeen Ali",
                    "Ravindra Jadeja",
                    "MS Dhoni (c & wk)",
                    "Sameer Rizvi",
                    "Shardul Thakur",
                    "Deepak Chahar",
                    "Matheesha Pathirana",
                    "Tushar Deshpande",
                  ],
                  changes_from_last_match: [
                    {
                      player_in: "Sameer Rizvi",
                      player_out: "Ambati Rayudu",
                      reason: "Giving an opportunity to the young batter.",
                    },
                  ],
                },
                {
                  team_name: "Rajasthan Royals",
                  projected_xi: [
                    "Yashasvi Jaiswal",
                    "Jos Buttler",
                    "Sanju Samson (c & wk)",
                    "Riyan Parag",
                    "Shimron Hetmyer",
                    "Dhruv Jurel",
                    "Ravichandran Ashwin",
                    "Trent Boult",
                    "Prasidh Krishna",
                    "Yuzvendra Chahal",
                    "Nandre Burger",
                  ],
                  changes_from_last_match: [
                    {
                      player_in: "Nandre Burger",
                      player_out: "Kuldeep Sen",
                      reason: "Injury replacement.",
                    },
                  ],
                },
              ],
            },
            {
              match_number: 61,
              teams: "Punjab Kings vs Mumbai Indians",
              venue: "Narendra Modi Stadium, Ahmedabad",
              lineups: [
                {
                  team_name: "Punjab Kings",
                  projected_xi: [
                    "Prabhsimran Singh",
                    "Shikhar Dhawan (c)",
                    "Liam Livingstone",
                    "Jitesh Sharma (wk)",
                    "Sam Curran",
                    "Shashank Singh",
                    "Ashutosh Sharma",
                    "Harpreet Brar",
                    "Kagiso Rabada",
                    "Arshdeep Singh",
                    "Rahul Chahar",
                  ],
                  changes_from_last_match: [
                    {
                      player_in: "Shikhar Dhawan",
                      player_out: "Atharva Taide",
                      reason: "Dhawan returns after injury.",
                    },
                  ],
                },
                {
                  team_name: "Mumbai Indians",
                  projected_xi: [
                    "Ishan Kishan (wk)",
                    "Rohit Sharma",
                    "Suryakumar Yadav",
                    "Tilak Varma",
                    "Hardik Pandya (c)",
                    "Tim David",
                    "Nehal Wadhera",
                    "Piyush Chawla",
                    "Jasprit Bumrah",
                    "Gerald Coetzee",
                    "Akash Madhwal",
                  ],
                  changes_from_last_match: [
                    {
                      player_in: "Nehal Wadhera",
                      player_out: "Dewald Brevis",
                      reason: "Tactical change for better balance.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    setMatchData(sampleData.ipl_match_lineups_and_changes);
    setFilteredData(sampleData.ipl_match_lineups_and_changes);
  }, []);

  // Function to filter data by date
  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, "MMM d, yyyy");
      const filteredMatches = matchData.filter((day) => {
        const dayDate = new Date(day.date);
        return format(dayDate, "MMM d, yyyy") === dateStr;
      });

      if (filteredMatches.length > 0) {
        setFilteredData(filteredMatches);
      } else {
        // If no matches found for the selected date, show a message or empty state
        setFilteredData([]);
      }
    } else {
      // If no date selected, show all matches
      setFilteredData(matchData);
    }
  }, [selectedDate, matchData]);

  // Function to get team color
  const getTeamColor = (
    teamName: string,
    type:
      | "bg"
      | "border"
      | "text"
      | "accent"
      | "highlight"
      | "light"
      | "gradient"
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

  // Extract team names from "Team1 vs Team2" format
  const getTeamNames = (teams: string): [string, string] => {
    const [team1, team2] = teams.split(" vs ");
    return [team1, team2];
  };

  // Function to get player icon based on role
  const getPlayerIcon = (player: string) => {
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

  // Function to trigger animation
  const triggerAnimation = (team: TeamLineup) => {
    // Set the players for animation
    const playersIn = team.changes_from_last_match.map(
      (change) => change.player_in
    );
    const playersOut = team.changes_from_last_match.map(
      (change) => change.player_out
    );

    setAnimatingPlayers({ in: playersIn, out: playersOut });
    setShowAnimation(true);

    // Reset animation state after a delay
    setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Match Lineups</h1>
        </div>

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-auto flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <CalendarIcon className="h-4 w-4 text-blue-400" />
              {selectedDate ? format(selectedDate, "PPP") : "Select match date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className="bg-gray-800 text-white"
            />
            {selectedDate && (
              <div className="p-2 border-t border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-white hover:bg-gray-700"
                  onClick={() => setSelectedDate(undefined)}
                >
                  Reset
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {filteredData.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 text-center py-12">
          <CardContent>
            <p className="text-white text-lg">
              No matches found for the selected date.
            </p>
            <p className="text-gray-400 mt-2">
              Try selecting a different date or reset the filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {filteredData.map((day, dayIndex) => (
            <div key={dayIndex} className="space-y-6">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">{day.date}</h2>
              </div>

              {day.matches.map((match, matchIndex) => {
                return (
                  <Card
                    key={matchIndex}
                    className="bg-gray-800 border-gray-700 overflow-hidden"
                  >
                    <div className="flex bg-gray-700 p-4 items-center justify-between">
                      <div>
                        <Badge className="bg-indigo-600 text-white mb-2">
                          Match #{match.match_number}
                        </Badge>
                        <h3 className="text-xl font-bold text-white">
                          {match.teams}
                        </h3>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-sm">{match.venue}</span>
                      </div>
                    </div>

                    <Tabs
                      defaultValue={match.lineups[0].team_name}
                      className="w-full"
                    >
                      <TabsList className="w-full bg-gray-700 border-b border-gray-600 rounded-none">
                        {match.lineups.map((team, teamIndex) => (
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

                      {match.lineups.map((team, teamIndex) => (
                        <TabsContent
                          key={teamIndex}
                          value={team.team_name}
                          className="p-0"
                        >
                          <div className="p-4">
                            <div className="flex justify-end mb-4">
                              <Button
                                className={`${getTeamColor(
                                  team.team_name,
                                  "bg"
                                )} text-white`}
                                onClick={() => triggerAnimation(team)}
                              >
                                <Zap className="h-4 w-4 mr-2" />
                                Replay Transfers
                              </Button>
                            </div>

                            {/* Cricket Field Layout */}
                            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                              {/* Cricket Ground */}
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
                                  {team.projected_xi.map(
                                    (player, playerIndex) => {
                                      const isPlayerIn =
                                        team.changes_from_last_match.some(
                                          (change) =>
                                            change.player_in === player
                                        );
                                      const isPlayerOut = false; // These players are on the field

                                      return (
                                        <motion.div
                                          key={playerIndex}
                                          className="absolute"
                                          style={{
                                            top: playerPositions[playerIndex]
                                              .top,
                                            left: playerPositions[playerIndex]
                                              .left,
                                          }}
                                          initial={
                                            isPlayerIn && showAnimation
                                              ? { x: 200, opacity: 0 }
                                              : {}
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
                                    }
                                  )}
                                </div>
                              </div>

                              {/* Dugout */}
                              <div className="w-full lg:w-1/4">
                                <div
                                  className={`h-full relative overflow-hidden rounded-xl bg-gradient-to-br ${getTeamColor(
                                    team.team_name,
                                    "gradient"
                                  )} border-4 ${getTeamColor(
                                    team.team_name,
                                    "border"
                                  )}`}
                                >
                                  <div className="p-4">
                                    <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                                      <Users className="h-4 w-4 mr-2" />
                                      Team Dugout
                                    </h3>

                                    {/* Players in the dugout - these are the ones leaving */}
                                    <div className="space-y-2">
                                      {team.changes_from_last_match.map(
                                        (change, changeIndex) => (
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
                                              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-red-900 text-white mr-2">
                                                {getPlayerIcon(
                                                  change.player_out
                                                )}
                                              </div>
                                              <div>
                                                <p className="text-sm font-medium text-white">
                                                  {change.player_out}
                                                </p>
                                                <Badge className="bg-red-600 text-white mt-1">
                                                  OUT
                                                </Badge>
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
                                            <p className="text-xs text-gray-300 mt-1">
                                              {change.reason}
                                            </p>
                                          </motion.div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Playing XI List */}
                            <div>
                              <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                                <Users className="h-5 w-5 mr-2 text-blue-400" />
                                Full Playing XI
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {team.projected_xi.map(
                                  (player, playerIndex) => {
                                    const isPlayerIn =
                                      team.changes_from_last_match.some(
                                        (change) => change.player_in === player
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
                                        <div
                                          className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${getTeamColor(
                                            team.team_name,
                                            "bg"
                                          )} text-white`}
                                        >
                                          {getPlayerIcon(player)}
                                        </div>
                                        <p className="text-sm text-white">
                                          {player}
                                          {isPlayerIn && (
                                            <Badge className="ml-2 bg-green-600 text-white">
                                              NEW
                                            </Badge>
                                          )}
                                        </p>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CricketFieldLineups;
