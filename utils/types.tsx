export type Question = {
  id: string;
  text: string;
  status: "answered" | "unanswered";
  answer: string | null;
};

export type Match = {
  id: string;
  team1: string;
  team2: string;
  date: string;
  league: string;
  isCompleted : boolean;
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