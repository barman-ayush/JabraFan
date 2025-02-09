import Matches from "@/app/components/Matches";
import RcbImage from "@/public/images/RCB.jpg";
import CskImage from "@/public/images/CSK.jpg";

const matches = [
  {
    id: 1,
    competition: "Indian Premier League",
    date: "Sunday, 3 September 2023",
    time: "20:00",
    homeTeam: {
      name: "RCB",
      logo: RcbImage.src,
    },
    awayTeam: {
      name: "CSK",
      logo: CskImage.src,
    },
    score: {
      home: 167,
      away: 144,
      homeWickets: 5,
      awayWickets: 7,
      homeOvers: "20.0",
      awayOvers: "20.0",
    },
  },
  {
    id: 2,
    competition: "Indian Premier League",
    date: "Monday, 4 September 2023",
    time: "19:30",
    homeTeam: {
      name: "CSK",
      logo: CskImage.src,
    },
    awayTeam: {
      name: "RCB",
      logo: RcbImage.src,
    },
    score: {
      home: 189,
      away: 156,
      homeWickets: 3,
      awayWickets: 8,
      homeOvers: "20.0",
      awayOvers: "19.2",
    },
  },
];

export default function Page() {
  return (
    <div className="p-4 space-y-4">
      {matches.map((match, index) => (
        <Matches key={index} {...match} />
      ))}
    </div>
  );
}
