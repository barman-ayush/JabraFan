import { Fragment } from "react";
import { motion } from "framer-motion";

const NoRisingStarThisWeek = ({formattedDateRange} : {formattedDateRange : string}) => {
  return (
    <Fragment>
      <motion.div
        className="bg-black text-white border border-gray-700 shadow-lg rounded-lg p-8 text-center mx-auto max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          boxShadow: [
            "0 4px 6px rgba(50, 50, 93, 0.11)",
            "0 10px 15px rgba(50, 50, 93, 0.25)",
            "0 4px 6px rgba(50, 50, 93, 0.11)",
          ],
        }}
        transition={{
          duration: 0.7,
          boxShadow: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          },
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.h2
            className="text-2xl font-bold text-white mb-4"
            animate={{
              color: ["#ffffff", "#29b6f6", "#ffffff"],
              textShadow: [
                "0 0 5px rgba(0,194,255,0)",
                "0 0 15px rgba(0,194,255,0.5)",
                "0 0 5px rgba(0,194,255,0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            No Rising Stars Data Available
          </motion.h2>
          <motion.p
            className="text-gray-300 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            There are no rising star performances available for{" "}
            <motion.span
              className="font-semibold text-blue-400"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {formattedDateRange}
            </motion.span>
          </motion.p>
          <motion.p
            className="mt-4 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Please try selecting a different week.
          </motion.p>
        </motion.div>
      </motion.div>
    </Fragment>
  );
};
export default NoRisingStarThisWeek;
