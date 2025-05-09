"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { User, Shield, Shirt, Award, Trophy } from "lucide-react";
import { format } from "date-fns";

import { MatchDay, MatchLineupData } from "@/utils/types";
import DatePickerTeamChanges from "@/components/date-picker-team-changes.component";
import TeamChanges from "@/components/team-changes.component";

const CricketFieldLineups = () => {
  const [matchData, setMatchData] = useState<MatchDay[]>([]);
  const [filteredData, setFilteredData] = useState<MatchDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [animatingPlayers, setAnimatingPlayers] = useState<{
    in: string[];
    out: string[];
  }>({ in: [], out: [] });
  const [showAnimation, setShowAnimation] = useState<boolean>(false);

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

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Match Lineups</h1>
        </div>
        <DatePickerTeamChanges
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
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
            <TeamChanges
              key={dayIndex}
              day={day}
              setAnimatingPlayers={setAnimatingPlayers}
              setShowAnimation={setShowAnimation}
              showAnimation={showAnimation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CricketFieldLineups;
