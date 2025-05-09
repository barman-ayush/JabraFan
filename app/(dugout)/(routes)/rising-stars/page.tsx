"use client";
import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { TeamRisingPlayer } from "@/utils/types";
import RisingStarCard from "@/components/rising-star-card.component";
import { motion } from "framer-motion";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
} from "date-fns";
import axios from "axios";
import { useFlash } from "@/components/Flash.component";
import PopoverRisingStar from "@/components/rising-star-date-popover.component";
import NoRisingStarThisWeek from "@/components/ErrorTemplates/rising-star.component";

const RisingStars = () => {
  const [risingPlayers, setRisingPlayers] = useState<TeamRisingPlayer[] | []>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [noDataAvailable, setNoDataAvailable] = useState<boolean>(false);
  const { flash } = useFlash();

  // Initialize with current week
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(today, { weekStartsOn: 1 }) // Week starts on Monday
  );

  // Calculate week end based on start
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

  // Generate days of the current week for display
  const daysOfWeek = eachDayOfInterval({
    start: currentWeekStart,
    end: currentWeekEnd,
  });

  
  // Fetch rising stars based on selected week
  useEffect(() => {
    const fetchRisingStars = async () => {
      try {
        setIsLoading(true);
        setNoDataAvailable(false);

        // Format the date for API request (YYYY-MM-DD)
        const formattedDate = format(currentWeekStart, "yyyy-MM-dd");

        const response = await axios.get(
          `/api/dugout/rising-stars?date=${formattedDate}`
        );
        console.log("API Response:", response.data);

        if (response.data.success) {
          setRisingPlayers(response.data.risingPlayers);
        } else {
          setNoDataAvailable(true);
          setRisingPlayers([]);
        }
      } catch (error) {
        console.error("Failed to fetch rising stars:", error);
        setRisingPlayers([]);
        setNoDataAvailable(true);
        flash("Failed to fetch rising stars data", { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRisingStars();
  }, [currentWeekStart, flash]);

  // Format the date range for display
  const formattedDateRange: string = `${format(
    currentWeekStart,
    "MMM d"
  )} - ${format(currentWeekEnd, "MMM d, yyyy")}`;

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-blue-400" />
          <h1 className="text-3xl font-bold">Rising Stars</h1>
        </div>

        <PopoverRisingStar
          formattedDateRange={formattedDateRange}
          setCurrentWeekStart={setCurrentWeekStart}
          daysOfWeek={daysOfWeek}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : noDataAvailable ? (
        <NoRisingStarThisWeek formattedDateRange={formattedDateRange} />
        
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {risingPlayers.map(
            (risingPlayer: TeamRisingPlayer, index: number) => (
              <RisingStarCard
                key={`${risingPlayer.team}-${index}`}
                RisingPlayer={risingPlayer}
                index={index}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default RisingStars;
