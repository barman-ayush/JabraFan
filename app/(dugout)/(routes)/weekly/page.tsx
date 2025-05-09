"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Calendar, 
  AlertTriangle, 
  Activity, 
  User, 
  MapPin, 
  Trophy, 
  RefreshCw
} from "lucide-react";

// Types for our data
interface Update {
  date: string;
  update: string;
}

interface UpdatesData {
  ipl_updates_last_week: Update[];
}

const WeeklyUpdates = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [groupedUpdates, setGroupedUpdates] = useState<{[key: string]: Update[]}>({});

  useEffect(() => {
    // This is where you would normally fetch the data from an API
    // For now, we'll use the sample data provided
    const sampleData: UpdatesData = {
      "ipl_updates_last_week": [
        {
          "date": "May 8, 2025",
          "update": "Match 58 between Punjab Kings and Delhi Capitals in Dharamsala was abandoned midway due to floodlight issues, later revealed to be related to security concerns amidst rising Indo-Pak tensions."
        },
        {
          "date": "May 8, 2025",
          "update": "Match 61 between Punjab Kings and Mumbai Indians, originally scheduled in Dharamsala on May 11th, has been shifted to Ahmedabad due to security reasons."
        },
        {
          "date": "May 8, 2025",
          "update": "Rajasthan Royals signed Nandre Burger as an injury replacement for Sandeep Sharma."
        },
        {
          "date": "May 7, 2025",
          "update": "Match 57: Chennai Super Kings defeated Kolkata Knight Riders by 2 wickets in a close encounter at Eden Gardens. Noor Ahmad of CSK took 4 wickets, while Dewald Brevis scored a crucial 52 for CSK."
        },
        {
          "date": "May 7, 2025",
          "update": "Delhi Capitals named Sediqullah Atal as a replacement for the injured Harry Brook."
        },
        {
          "date": "May 7, 2025",
          "update": "Royal Challengers Bangalore signed Mayank Agarwal as an injury replacement for Devdutt Padikkal."
        },
        {
          "date": "May 6, 2025",
          "update": "Match 56: Gujarat Titans defeated Mumbai Indians by 3 wickets (D/L method) at Wankhede Stadium. Shubman Gill scored 43 for GT."
        },
        {
          "date": "May 5, 2025",
          "update": "Match 55 between Sunrisers Hyderabad and Delhi Capitals at Rajiv Gandhi International Stadium was abandoned due to rain."
        },
        {
          "date": "May 5, 2025",
          "update": "Chennai Super Kings signed Urvil Patel as an injury replacement for Vansh Bedi."
        },
        {
          "date": "May 5, 2025",
          "update": "Sunrisers Hyderabad signed Harsh Dubey as an injury replacement for Smaran Ravichandran."
        },
        {
          "date": "May 4, 2025",
          "update": "Match 54: Punjab Kings defeated Lucknow Super Giants by 37 runs in Dharamsala. Prabhsimran Singh scored 91 for PBKS."
        },
        {
          "date": "May 4, 2025",
          "update": "Match 53: Kolkata Knight Riders defeated Rajasthan Royals by 1 run in a thrilling match at Eden Gardens."
        },
        {
          "date": "May 3, 2025",
          "update": "Match 52: Royal Challengers Bangalore defeated Chennai Super Kings by 2 runs in Bengaluru. Romario Shepherd was the player of the match."
        },
        {
          "date": "May 2, 2025",
          "update": "Match 51: Gujarat Titans defeated Sunrisers Hyderabad by 38 runs in Ahmedabad. Prasidh Krishna was the player of the match."
        },
        {
          "date": "May 1, 2025",
          "update": "Match 50: Mumbai Indians defeated Rajasthan Royals by 100 runs in Jaipur. Ryan Rickelton was the player of the match."
        },
        {
          "date": "Ongoing",
          "update": "Rising tensions between India and Pakistan have led to increased security concerns, impacting IPL venues near the border. The BCCI is closely monitoring the situation and in discussions with the government regarding the continuation of the tournament."
        },
        {
          "date": "May 9, 2025",
          "update": "BREAKING: The BCCI has indefinitely suspended IPL 2025 due to escalating Indo-Pak tensions. The decision was made after the PBKS vs DC match was called off midway on May 8th. Players' safety is the top priority, and the BCCI will decide on the tournament's future based on government advice."
        }
      ]
    };
    
    setUpdates(sampleData.ipl_updates_last_week);
    
    // Group updates by date
    const grouped = sampleData.ipl_updates_last_week.reduce((acc, update) => {
      if (!acc[update.date]) {
        acc[update.date] = [];
      }
      acc[update.date].push(update);
      return acc;
    }, {} as {[key: string]: Update[]});
    
    setGroupedUpdates(grouped);
  }, []);

  // Function to determine icon based on update content
  const getUpdateIcon = (update: string) => {
    if (update.includes("BREAKING")) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    } else if (update.includes("tensions") || update.includes("security") || update.includes("abandoned")) {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    } else if (update.includes("Match") && (update.includes("defeated") || update.includes("won"))) {
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    } else if (update.includes("replacement") || update.includes("signed")) {
      return <User className="h-5 w-5 text-blue-500" />;
    } else if (update.includes("shifted") || update.includes("venue")) {
      return <MapPin className="h-5 w-5 text-green-500" />;
    } else {
      return <Activity className="h-5 w-5 text-purple-500" />;
    }
  };

  // Function to determine if update is about a team
  const isTeamUpdate = (update: string) => {
    const iplTeams = [
      "Mumbai Indians",
      "Chennai Super Kings",
      "Gujarat Titans",
      "Delhi Capitals",
      "Rajasthan Royals",
      "Kolkata Knight Riders",
      "Punjab Kings",
      "Lucknow Super Giants",
      "Sunrisers Hyderabad",
      "Royal Challengers Bangalore"
    ];
    
    return iplTeams.some(team => update.includes(team));
  };

  // Function to extract team name from update
  const getTeamFromUpdate = (update: string) => {
    const iplTeams = [
      "Mumbai Indians",
      "Chennai Super Kings",
      "Gujarat Titans",
      "Delhi Capitals",
      "Rajasthan Royals",
      "Kolkata Knight Riders",
      "Punjab Kings",
      "Lucknow Super Giants",
      "Sunrisers Hyderabad",
      "Royal Challengers Bangalore"
    ];
    
    for (const team of iplTeams) {
      if (update.includes(team)) {
        return team;
      }
    }
    
    return null;
  };
  
  // Function to get team color (simplified version)
  const getTeamColor = (team: string | null) => {
    if (!team) return "bg-gray-600";
    
    const teamColors: {[key: string]: string} = {
      "Mumbai Indians": "bg-blue-700",
      "Chennai Super Kings": "bg-yellow-500",
      "Gujarat Titans": "bg-blue-600",
      "Delhi Capitals": "bg-blue-500",
      "Rajasthan Royals": "bg-pink-600",
      "Kolkata Knight Riders": "bg-purple-600",
      "Punjab Kings": "bg-red-600",
      "Lucknow Super Giants": "bg-teal-600",
      "Sunrisers Hyderabad": "bg-orange-600",
      "Royal Challengers Bangalore": "bg-red-700"
    };

    return teamColors[team] || "bg-gray-600";
  };

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedUpdates).sort((a, b) => {
    if (a === "Ongoing") return -1;
    if (b === "Ongoing") return 1;
    
    // Convert dates to comparable format
    const dateA = a === "Ongoing" ? new Date() : new Date(a);
    const dateB = b === "Ongoing" ? new Date() : new Date(b);
    
    // Sort in descending order (most recent first)
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen">
      <div className="flex items-center mb-6">
        <RefreshCw className="h-6 w-6 mr-2 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">IPL Weekly Updates</h1>
      </div>
      
      {/* Breaking news banner */}
      {updates.some(u => u.update.includes("BREAKING")) && (
        <Card className="mb-6 border-red-600 bg-gray-800 border-2">
          <CardContent className="p-4">
            {updates.filter(u => u.update.includes("BREAKING")).map((update, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-red-700 text-white">BREAKING NEWS</Badge>
                    <span className="text-sm text-red-400">{update.date}</span>
                  </div>
                  <p className="text-white text-lg font-medium">{update.update.replace("BREAKING: ", "")}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Timeline view */}
      <div className="space-y-6">
        {sortedDates.map((date) => (
          <div key={date} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="flex items-center p-4 bg-gray-700">
              <Calendar className="h-5 w-5 mr-2 text-blue-400" />
              <h2 className="text-xl font-bold text-white">
                {date === "Ongoing" ? "Ongoing Situation" : date}
              </h2>
            </div>
            
            <div className="p-4 space-y-4">
              {groupedUpdates[date].map((update, updateIdx) => {
                const team = getTeamFromUpdate(update.update);
                const isMatch = update.update.includes("Match");
                
                return (
                  <div key={updateIdx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full ${
                        update.update.includes("BREAKING") ? "bg-red-700" :
                        isMatch ? "bg-indigo-700" :
                        team ? getTeamColor(team) : "bg-gray-600"
                      }`}>
                        {getUpdateIcon(update.update)}
                      </div>
                      {updateIdx < groupedUpdates[date].length - 1 && (
                        <div className="w-0.5 h-full bg-gray-600 mt-2"></div>
                      )}
                    </div>
                    
                    <Card className="flex-1 bg-gray-700 border-gray-600">
                      <CardContent className="p-3">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {isMatch && (
                            <Badge className="bg-indigo-600 text-white">Match Update</Badge>
                          )}
                          
                          {team && (
                            <Badge className={`${getTeamColor(team)} text-white`}>
                              {team}
                            </Badge>
                          )}
                          
                          {update.update.includes("abandoned") && (
                            <Badge className="bg-amber-600 text-white">Abandoned</Badge>
                          )}
                          
                          {update.update.includes("replacement") && (
                            <Badge className="bg-blue-600 text-white">Player Replacement</Badge>
                          )}
                          
                          {update.update.includes("shifted") && (
                            <Badge className="bg-green-600 text-white">Venue Change</Badge>
                          )}
                          
                          {update.update.includes("security") && (
                            <Badge className="bg-red-600 text-white">Security Concern</Badge>
                          )}
                        </div>
                        
                        <p className="text-white">
                          {isMatch 
                            ? update.update.split(":").map((part, i) => 
                                i === 0 
                                  ? <span key={i} className="font-bold text-blue-300">{part}:</span>
                                  : <span key={i}>{part}</span>
                              )
                            : update.update
                          }
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyUpdates;