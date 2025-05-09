"use client";
import { useState, useEffect } from "react";
import { TrendingUp, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { TeamRisingPlayer } from "@/utils/types";
import RisingStarCard from "@/components/rising-star-card.component";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  addWeeks, 
  subWeeks, 
  isSameDay,
  eachDayOfInterval
} from "date-fns";
import axios from "axios";
import { useFlash } from "@/components/Flash.component";

const RisingStars = () => {
  const [risingPlayers, setRisingPlayers] = useState<TeamRisingPlayer[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [noDataAvailable, setNoDataAvailable] = useState<boolean>(false);
  const { flash } = useFlash();
  
  // Initialize with current week
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(today, { weekStartsOn: 1 }) // Week starts on Monday
  );
  
  // Calculate week end based on start
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  
  // Generate days of the current week for display
  const daysOfWeek = eachDayOfInterval({
    start: currentWeekStart,
    end: currentWeekEnd
  });

  // Navigate to previous week
  const gotoPreviousWeek = () => {
    setCurrentWeekStart(prevStart => subWeeks(prevStart, 1));
  };

  // Navigate to next week
  const gotoNextWeek = () => {
    setCurrentWeekStart(prevStart => addWeeks(prevStart, 1));
  };

  // Select today's week
  const gotoCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  // Fetch rising stars based on selected week
  useEffect(() => {
    const fetchRisingStars = async () => {
      try {
        setIsLoading(true);
        setNoDataAvailable(false);
        
        // Format the date for API request (YYYY-MM-DD)
        const formattedDate = format(currentWeekStart, "yyyy-MM-dd");
        
        const response = await axios.get(`/api/dugout/rising-stars?date=${formattedDate}`);
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
  const formattedDateRange = `${format(currentWeekStart, "MMM d")} - ${format(currentWeekEnd, "MMM d, yyyy")}`;

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-blue-400" />
          <h1 className="text-3xl font-bold">Rising Stars</h1>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>{formattedDateRange}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 bg-gray-700 border-gray-600"
                onClick={gotoPreviousWeek}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium">{formattedDateRange}</div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 bg-gray-700 border-gray-600"
                onClick={gotoNextWeek}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mt-4">
              {daysOfWeek.map((day) => (
                <div 
                  key={day.toString()}
                  className="text-center"
                >
                  <div className="text-xs text-gray-400 mb-1">
                    {format(day, 'EEE')}
                  </div>
                  <motion.div 
                    className={`text-sm p-2 rounded-full ${
                      isSameDay(day, today) 
                        ? 'bg-blue-600' 
                        : 'bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {format(day, 'd')}
                  </motion.div>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              className="w-full mt-4 bg-gray-700 border-gray-600 hover:bg-gray-600"
              onClick={gotoCurrentWeek}
            >
              Current Week
            </Button>
          </PopoverContent>
        </Popover>
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
        <motion.div 
          className="bg-black text-white border border-gray-700 shadow-lg rounded-lg p-8 text-center mx-auto max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            boxShadow: [
              "0 4px 6px rgba(50, 50, 93, 0.11)",
              "0 10px 15px rgba(50, 50, 93, 0.25)",
              "0 4px 6px rgba(50, 50, 93, 0.11)"
            ]
          }}
          transition={{ 
            duration: 0.7, 
            boxShadow: { 
              repeat: Infinity, 
              duration: 2, 
              ease: "easeInOut" 
            } 
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
                  "0 0 5px rgba(0,194,255,0)"
                ]
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
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {risingPlayers.map((risingPlayer: TeamRisingPlayer, index: number) => (
            <RisingStarCard key={`${risingPlayer.team}-${index}`} RisingPlayer={risingPlayer} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RisingStars;