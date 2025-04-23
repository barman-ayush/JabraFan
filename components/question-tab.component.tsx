import { Fragment } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import Questions from "./Questions";
import { motion } from "framer-motion";
import { Question } from "@/utils/types";

interface QuestionTabProps {
  questions: Question[];
  fetchUserCredits: () => Promise<void>;
}

const QuestionTab = ({ questions, fetchUserCredits }: QuestionTabProps) => {
  return (
    <Fragment>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Match Predictions</h2>
        <Badge variant="outline" className="text-xs">
          {questions.length} predictions
        </Badge>
      </div>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground">
                No predictions available for this match
              </p>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            {questions.map((question, index) => (
              <motion.div
                key={question.id || index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <Questions
                      fetchUserCredits={fetchUserCredits}
                      id={index} // Using index for unique ID
                      question={question}
                      options={["yes", "no"]}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Fragment>
  );
};
export default QuestionTab;
