import { Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ShowChangesProps {
  scoreChanged: boolean;
  animationKey: string;
  currentScore: string;
}

const ShowChanges = ({
  scoreChanged,
  animationKey,
  currentScore,
}: ShowChangesProps) => {
  return (
    <Fragment>
      <div className="flex flex-col items-center gap-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={animationKey}
            className="mt-2 bg-gradient-to-r from-purple-800 to-purple-700 border-purple-600/50 px-4 py-2 rounded-full text-pink-100 font-semibold shadow-md border"
            initial={scoreChanged ? { opacity: 0.5, y: -10 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            {currentScore}
          </motion.div>
        </AnimatePresence>

        {/* Add a subtle indicator when score changes */}
        {scoreChanged && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 right-0 -mr-1 -mt-1 h-2 w-2 bg-green-400 rounded-full"
          ></motion.div>
        )}
      </div>
    </Fragment>
  );
};
export default ShowChanges;
