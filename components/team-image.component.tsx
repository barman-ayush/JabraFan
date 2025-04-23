import { teamColors, teamImageMap } from "@/data/ImageMap";
import { motion } from "framer-motion";
import Image from "next/image";
import { Fragment } from "react";
const TeamView = ({ teamName }: { teamName: string }) => {
  const getTeamColor = (teamName: string): string => {
    return teamColors[teamName] || "bg-gray-100 text-gray-800";
  };

  return (
    <Fragment>
      <div className="flex flex-col items-center text-center w-5/12">
        <div
          className={`w-16 h-16 ${getTeamColor(
            teamName
          )} rounded-full flex items-center justify-center mb-2 shadow-md transition-all duration-300 group-hover:shadow-lg overflow-hidden border-2 border-purple-800`}
        >
          {teamImageMap[teamName] ? (
            <Image
              src={teamImageMap[teamName]}
              alt={teamName}
              width={64}
              height={64}
              className="object-contain p-1"
            />
          ) : (
            teamName.substring(0, 2)
          )}
        </div>
        <h3 className="font-semibold text-sm text-pink-100">{teamName}</h3>
      </div>
    </Fragment>
  );
};
export default TeamView;

export const AnimatedTeamView = ({ teamName }: { teamName: string }) => {
  return (
    <Fragment>
      <motion.div
        className="text-center flex-1"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col items-center">
          <motion.div
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-800 mb-3 bg-white/10 shadow-lg flex items-center justify-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            {teamImageMap[teamName] ? (
              <Image
                src={teamImageMap[teamName]}
                alt={teamName}
                width={96}
                height={96}
                className="object-contain p-2"
              />
            ) : (
              <span className="text-2xl font-bold">
                {teamName.substring(0, 2)}
              </span>
            )}
          </motion.div>
          <motion.h2
            className="text-2xl font-bold text-pink-100"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {teamName}
          </motion.h2>
          {/* {renderScoreDisplay("team1")} */}
        </div>
      </motion.div>
    </Fragment>
  );
};

export const AnimatedVersus = () => {
  return (
    <Fragment>
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <motion.div
          className="text-xl font-bold text-pink-300 bg-purple-950 rounded-full p-3 border border-purple-800 shadow-md mb-2"
          animate={{
            boxShadow: [
              "0 4px 6px rgba(0, 0, 0, 0.1)",
              "0 6px 15px rgba(139, 92, 246, 0.3)",
              "0 4px 6px rgba(0, 0, 0, 0.1)",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
          }}
        >
          VS
        </motion.div>
      </motion.div>
    </Fragment>
  );
};
