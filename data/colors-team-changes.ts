// Team colors mapping
type TeamColor = {
    bg: string,
    border: string,
    text: string,
    accent: string,
    highlight: string,
    light: string,
    gradient: string,
}


export const teamColors: Record<string, TeamColor> = {
    "Royal Challengers Bangalore": {
        bg: "bg-red-700",
        border: "border-red-700",
        text: "text-red-400",
        accent: "bg-red-900",
        highlight: "bg-red-800",
        light: "bg-red-400",
        gradient: "from-red-800 to-red-900",
    },
    "Gujarat Titans": {
        bg: "bg-blue-600",
        border: "border-blue-600",
        text: "text-blue-400",
        accent: "bg-blue-900",
        highlight: "bg-blue-800",
        light: "bg-blue-400",
        gradient: "from-blue-800 to-blue-900",
    },
    "Chennai Super Kings": {
        bg: "bg-yellow-500",
        border: "border-yellow-500",
        text: "text-yellow-400",
        accent: "bg-yellow-800",
        highlight: "bg-yellow-700",
        light: "bg-yellow-400",
        gradient: "from-yellow-600 to-yellow-800",
    },
    "Rajasthan Royals": {
        bg: "bg-pink-600",
        border: "border-pink-600",
        text: "text-pink-400",
        accent: "bg-pink-900",
        highlight: "bg-pink-800",
        light: "bg-pink-400",
        gradient: "from-pink-800 to-pink-900",
    },
    "Punjab Kings": {
        bg: "bg-red-600",
        border: "border-red-600",
        text: "text-red-400",
        accent: "bg-red-900",
        highlight: "bg-red-800",
        light: "bg-red-400",
        gradient: "from-red-800 to-red-900",
    },
    "Mumbai Indians": {
        bg: "bg-blue-700",
        border: "border-blue-700",
        text: "text-blue-400",
        accent: "bg-blue-900",
        highlight: "bg-blue-800",
        light: "bg-blue-400",
        gradient: "from-blue-800 to-blue-900",
    },
    "Kolkata Knight Riders": {
        bg: "bg-purple-600",
        border: "border-purple-600",
        text: "text-purple-400",
        accent: "bg-purple-900",
        highlight: "bg-purple-800",
        light: "bg-purple-400",
        gradient: "from-purple-800 to-purple-900",
    },
    "Lucknow Super Giants": {
        bg: "bg-teal-600",
        border: "border-teal-600",
        text: "text-teal-400",
        accent: "bg-teal-900",
        highlight: "bg-teal-800",
        light: "bg-teal-400",
        gradient: "from-teal-800 to-teal-900",
    },
    "Sunrisers Hyderabad": {
        bg: "bg-orange-600",
        border: "border-orange-600",
        text: "text-orange-400",
        accent: "bg-orange-900",
        highlight: "bg-orange-800",
        light: "bg-orange-400",
        gradient: "from-orange-800 to-orange-900",
    },
    "Delhi Capitals": {
        bg: "bg-blue-500",
        border: "border-blue-500",
        text: "text-blue-300",
        accent: "bg-blue-800",
        highlight: "bg-blue-700",
        light: "bg-blue-300",
        gradient: "from-blue-700 to-blue-800",
    },
};

// Player position coordinates on the field
export const playerPositions: { top: string; left: string }[] = [
    { top: "35%", left: "50%" }, // wicketkeeper
    { top: "60%", left: "50%" }, // bowler
    { top: "45%", left: "30%" }, // slip
    { top: "45%", left: "70%" }, // slip/gully
    { top: "65%", left: "30%" }, // point
    { top: "65%", left: "70%" }, // cover
    { top: "80%", left: "20%" }, // deep midwicket
    { top: "80%", left: "50%" }, // long on
    { top: "80%", left: "80%" }, // deep cover
    { top: "25%", left: "30%" }, // square leg
    { top: "25%", left: "70%" }, // fine leg
];