import { Fragment } from "react";
import { motion } from "framer-motion";
export const MatchLoader = () => {
  return (
    <Fragment>
      <div className="container mx-auto p-4 flex justify-center items-center h-48">
        <motion.div
          className="rounded-full h-8 w-8 border-t-2 border-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        ></motion.div>
      </div>
    </Fragment>
  );
};

export const InitialScoreFetch = () => {
  return (
    <Fragment>
      <motion.div
        className="mt-2 bg-purple-800/50 px-4 py-1 rounded-full text-pink-100 font-semibold shadow-md flex items-center justify-center"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="h-4 w-16 bg-purple-700/50 rounded"></div>
      </motion.div>
    </Fragment>
  );
};

export const RealTimeScoreLoading = ({ score } : {score : string | undefined}) => {
  return (
    <Fragment>
      <div className="flex flex-col items-center gap-1">
        <div className="relative">
          <motion.div
            className="mt-2 bg-gradient-to-r from-purple-800 to-purple-700 border-purple-600/50 px-4 py-2 rounded-full text-pink-100 font-semibold shadow-md border"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {score}
          </motion.div>

          {/* Overlay refresh indicator */}
          <motion.div
            className="absolute top-0 right-0 h-4 w-4 bg-purple-600 rounded-full"
            initial={{ opacity: 0.7 }}
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
            }}
          />
        </div>
      </div>
    </Fragment>
  );
};
