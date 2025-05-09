import { iplTeamColorsObject } from "@/utils/types";

export const teamImageMap: Record<string, string> = {
  "Mumbai Indians": "/images/MI.png",
  "Chennai Super Kings": "/images/CSK.png",
  "Royal Challengers Bengaluru": "/images/RCB.png",
  "Kolkata Knight Riders": "/images/KKR.png",
  "Delhi Capitals": "/images/DC.jpg",
  "Sunrisers Hyderabad": "/images/SRH.png",
  "Punjab Kings": "/images/PBKS.png",
  "Rajasthan Royals": "/images/RR.png",
  "Gujarat Titans": "/images/GT.png",
  "Lucknow Super Giants": "/images/LSG.png",
};

export const teamColors: Record<string, string> = {
  "Chennai Super Kings": "bg-yellow-400 text-yellow-800",
  "Mumbai Indians": "bg-blue-600 text-blue-800",
  "Kolkata Knight Riders": "bg-purple-400 text-purple-800",
  "Delhi Capitals": "bg-blue-400 text-blue-800",
  "Sunrisers Hyderabad": "bg-orange-400 text-orange-800",
  "Punjab Kings": "bg-red-500 text-red-800",
  "Rajasthan Royals": "bg-pink-500 text-pink-800",
  "Gujarat Titans": "bg-teal-400 text-teal-800",
  "Lucknow Super Giants": "bg-green-500 text-green-800",
  "Royal Challengers Bangaluru": "bg-red-500 text-red-800",
};



// Custom IPL team colors that better match their jerseys and themes
export const iplTeamColors: Record<string, iplTeamColorsObject> = {
  "Mumbai Indians": {
    bg: "bg-blue-700",
    border: "border-blue-700",
    text: "text-blue-400",
    accent: "bg-blue-900",
    highlight: "bg-blue-800",
  },
  "Chennai Super Kings": {
    bg: "bg-yellow-500",
    border: "border-yellow-500",
    text: "text-yellow-400",
    accent: "bg-yellow-800",
    highlight: "bg-yellow-700",
  },
  "Gujarat Titans": {
    bg: "bg-blue-600",
    border: "border-blue-600",
    text: "text-blue-400",
    accent: "bg-blue-900",
    highlight: "bg-blue-800",
  },
  "Delhi Capitals": {
    bg: "bg-blue-500",
    border: "border-blue-500",
    text: "text-blue-300",
    accent: "bg-blue-800",
    highlight: "bg-blue-700",
  },
  "Rajasthan Royals": {
    bg: "bg-pink-600",
    border: "border-pink-600",
    text: "text-pink-400",
    accent: "bg-pink-900",
    highlight: "bg-pink-800",
  },
  "Kolkata Knight Riders": {
    bg: "bg-purple-600",
    border: "border-purple-600",
    text: "text-purple-400",
    accent: "bg-purple-900",
    highlight: "bg-purple-800",
  },
  "Punjab Kings": {
    bg: "bg-red-600",
    border: "border-red-600",
    text: "text-red-400",
    accent: "bg-red-900",
    highlight: "bg-red-800",
  },
  "Lucknow Super Giants": {
    bg: "bg-teal-600",
    border: "border-teal-600",
    text: "text-teal-400",
    accent: "bg-teal-900",
    highlight: "bg-teal-800",
  },
  "Sunrisers Hyderabad": {
    bg: "bg-orange-600",
    border: "border-orange-600",
    text: "text-orange-400",
    accent: "bg-orange-900",
    highlight: "bg-orange-800",
  },
  "Royal Challengers Bangalore": {
    bg: "bg-red-700",
    border: "border-red-700",
    text: "text-red-400",
    accent: "bg-red-900",
    highlight: "bg-red-800",
  },
};

