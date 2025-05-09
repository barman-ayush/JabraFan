import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type Question = {
  id: string;
  text: string;
  status: "answered" | "unanswered";
  answer: string | null;
  isActive: boolean;
};

export type Match = {
  id: string;
  team1: string;
  team2: string;
  date: string;
  league: string;
  isCompleted: boolean;
  questions: Question[];
};

export type RedeemRequest = {
  id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  userId: string;
  username?: string;
  email?: string;
  paymentMethod?: string;
  paymentDetails?: string;
  requestedAt: string;
  processedAt?: string | null;
  rejectionReason?: string | null;
};

export type UserCredits = {
  baseCredits: number;
  bonusCredits: number;
  totalCredits: number;
  answeredQuestions: number;
  correctAnswers: number;
};

// Navigation Menu Props
export type NavigatorItemProps = {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

// Generic :
export type IPLTeamName =
  | "Mumbai Indians"
  | "Chennai Super Kings"
  | "Gujarat Titans"
  | "Delhi Capitals"
  | "Rajasthan Royals"
  | "Kolkata Knight Riders"
  | "Punjab Kings"
  | "Lucknow Super Giants"
  | "Sunrisers Hyderabad"
  | "Royal Challengers Bangalore";

export type iplTeamColorsObject = {
  bg: string;
  border: string;
  text: string;
  accent: string;
  highlight: string;
};

// Headlines Page
export type performers = {
  player: string;
  performance: string;
};

export type MatchHeadline = {
  match_number: number;
  date: string;
  teams: {
    team1: string;
    team2: string;
  };
  result: string;
  headline: string;
  details: string;
  key_performers: {
    [teamName: string]: performers[];
  };
  venue: string;
};

// Rising Star
// Performance interface represents a single match performance
export interface PlayerPerformance {
  match: string;
  runs?: number | null;
  balls?: number | null;
  wickets?: number | null;
  economy?: number | null;
  note?: string;
}

// RisingPlayer interface represents a player's details
export interface RisingPlayer {
  name: string;
  role: string;
  last_week_performances: PlayerPerformance[];
}

// TeamRisingPlayer interface represents a team and its rising player
export interface TeamRisingPlayer {
  team: string;
  rising_player: RisingPlayer;
}


// Team Changes
export interface PlayerChange {
  player_in: string;
  player_out: string;
  reason: string;
}

export interface TeamLineup {
  team_name: string;
  projected_xi: string[];
  changes_from_last_match: PlayerChange[];
}

export interface TeamChangeMatch {
  match_number: number;
  teams: string;
  venue: string;
  lineups: TeamLineup[];
}

export interface MatchDay {
  date: string;
  matches: TeamChangeMatch[];
}

export interface MatchLineupData {
  ipl_match_lineups_and_changes: MatchDay[];
}