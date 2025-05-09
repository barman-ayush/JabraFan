import { MatchLineupData } from "@/utils/types";

const headlines = [
  {
    "match_number": 1,
    "date": "2025-05-07",
    "teams": {
      "team1": "Mumbai Indians",
      "team2": "Chennai Super Kings"
    },
    "result": "Chennai Super Kings won by 5 runs",
    "headline": "CSK Clinch Thrilling Last-Over Victory Against MI",
    "details": "Ruturaj Gaikwad's brilliant 85 and a crucial final over by Jadeja secure a 5-run win for CSK at Wankhede Stadium.",
    "key_performers": {
      "Chennai Super Kings": [
        { "player": "Ruturaj Gaikwad", "performance": "85 runs" },
        { "player": "Ravindra Jadeja", "performance": "2 wickets & 15* runs" }
      ],
      "Mumbai Indians": [
        { "player": "Rohit Sharma", "performance": "62 runs" },
        { "player": "Jasprit Bumrah", "performance": "3 wickets" }
      ]
    },
    "venue": "Wankhede Stadium, Mumbai"
  },
  {
    "match_number": 2,
    "date": "2025-05-07",
    "teams": {
      "team1": "Rajasthan Royals",
      "team2": "Gujarat Titans"
    },
    "result": "Rajasthan Royals won by 7 wickets",
    "headline": "Buttler Century Powers RR to Comfortable Win Over GT",
    "details": "Buttler's unbeaten 103 off 60 balls guides RR to a 7-wicket victory with 2 overs to spare at Sawai Mansingh Stadium.",
    "key_performers": {
      "Rajasthan Royals": [
        { "player": "Jos Buttler", "performance": "103* runs" },
        { "player": "Yuzvendra Chahal", "performance": "2 wickets" }
      ],
      "Gujarat Titans": [
        { "player": "Shubman Gill", "performance": "45 runs" },
        { "player": "Mohammed Shami", "performance": "1 wicket" }
      ]
    },
    "venue": "Sawai Mansingh Stadium, Jaipur"
  }
];


const risingStars = [
  {
    "team": "Mumbai Indians",
    "rising_player": {
      "name": "Nehal Wadhera",
      "role": "Batter",
      "last_week_performances": [
        { "match": "vs Lucknow Super Giants (May 1st)", "runs": null, "balls": null, "note": "No significant performance data found for the last week." }
      ]
    }
  },
  {
    "team": "Chennai Super Kings",
    "rising_player": {
      "name": "Sameer Rizvi",
      "role": "Batter",
      "last_week_performances": [
        { "match": "vs Punjab Kings (Apr 28th)", "runs": null, "balls": null, "note": "Last IPL match was on Apr 2025 vs CSK, no matches in the last week." }
      ]
    }
  },
  {
    "team": "Gujarat Titans",
    "rising_player": {
      "name": "Sai Sudharsan",
      "role": "Batter",
      "last_week_performances": [
        { "match": "vs Sunrisers Hyderabad (May 2nd)", "runs": 48, "balls": 23 }
      ]
    }
  },
  {
    "team": "Delhi Capitals",
    "rising_player": {
      "name": "Kumar Kushagra",
      "role": "Wicket-keeper Batter",
      "last_week_performances": [
        { "match": "No matches in the last week", "runs": null, "balls": null }
      ]
    }
  },
  {
    "team": "Rajasthan Royals",
    "rising_player": {
      "name": "Riyan Parag",
      "role": "All-rounder",
      "last_week_performances": [
        { "match": "vs Kolkata Knight Riders (May 4th)", "runs": 95, "balls": 45, "wickets": 1 }
      ]
    }
  },
  {
    "team": "Kolkata Knight Riders",
    "rising_player": {
      "name": "Suyash Sharma",
      "role": "Bowler",
      "last_week_performances": [
        { "match": "vs Sunrisers Hyderabad (Apr 29th)", "wickets": 2, "economy": 7.50 }
      ]
    }
  },
  {
    "team": "Punjab Kings",
    "rising_player": {
      "name": "Prabhsimran Singh",
      "role": "Batter",
      "last_week_performances": [
        { "match": "vs Lucknow Super Giants (May 4th)", "runs": 91, "balls": 48 },
        { "match": "vs Delhi Capitals (May 8th)", "runs": 50, "balls": null }
      ]
    }
  },
  {
    "team": "Lucknow Super Giants",
    "rising_player": {
      "name": "Ayush Badoni",
      "role": "Batter",
      "last_week_performances": [
        { "match": "vs Punjab Kings (May 4th)", "runs": 74, "balls": 40 }
      ]
    }
  },
  {
    "team": "Sunrisers Hyderabad",
    "rising_player": {
      "name": "Nitish Kumar Reddy",
      "role": "All-rounder",
      "last_week_performances": [
        { "match": "vs Gujarat Titans (May 2nd)", "runs": null, "balls": null, "wickets": null, "note": "No significant performance data found for the last week." }
      ]
    }
  },
  {
    "team": "Royal Challengers Bangalore",
    "rising_player": {
      "name": "Suyash Prabhudessai",
      "role": "Batter",
      "last_week_performances": [
        { "match": "No matches in the last week", "runs": null, "balls": null }
      ]
    }
  }
]

const sampleDataTeamLineup: MatchLineupData = {
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




class DugoutAI {


  async generateHeadlines() {
    return headlines;
  }

  async getRisingStars() {

  }

  async getTeamChanges() {

  }

  async getWeeklyRecap() {

  }
}

export const IPLMemory = new DugoutAI();
