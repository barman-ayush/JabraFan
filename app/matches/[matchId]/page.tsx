import Questions from "@/app/components/Questions";

type MatchPageProps = {
  params: {
    matchId: string;
  };
};

const sampleQuestions = [
  {
    id: 1,
    question: "Who will score the first goal?",
    options: ["Team A", "Team B", "No goals"],
  },
  {
    id: 2,
    question: "Will there be a red card?",
    options: ["Yes", "No"],
  },
  {
    id: 3,
    question: "Total number of corners",
    options: ["0-5", "6-10", "11+"],
  },
];

export default function MatchPage({ params }: MatchPageProps) {
  const { matchId } = params;
  console.log(matchId)

  return (
    <div className="p-4 space-y-4">
      {sampleQuestions.map((que) => (
        <Questions key={que.id} id={que.id} question={que.question} options={que.options} />
      ))}
    </div>
  );
}
