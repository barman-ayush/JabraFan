"use client";
import {  useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { MatchHeadline } from "@/utils/types";
import axios from "axios";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useFlash } from "@/components/Flash.component";
import { defaultMatchHeadline } from "@/utils/defaults";
import HeadlinesCard from "@/components/headlines-card.component";
import { motion } from "framer-motion";



const Headlines = () => {
  const [headlines, setHeadlines] =
    useState<MatchHeadline[]>(defaultMatchHeadline);
  const [currentHeadlineDate, setCurrentHeadlineDate] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [noHeadlinesAvailable, setNoHeadlinesAvailable] = useState(false);
  const { flash } = useFlash();

  // Format date to yy/mm/dd when date changes
  useEffect(() => {
    console.log("DATE CHENGE DETECCTED ");
    if (date) {
      const formattedDate = formatDateForApi(date);
      setCurrentHeadlineDate(formattedDate);
    }
  }, [date]);

  // Format date to yy/mm/dd for API
  const formatDateForApi = (date: Date): string => {
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  useEffect(() => {
    const fetchHeadlines = async () => {
      if (currentHeadlineDate) {
        try {
          // Reset state before fetching
          setNoHeadlinesAvailable(false);
          
          const response = await axios.get(
            `/api/dugout/headlines?date=${currentHeadlineDate}/1`
          );
          console.log("Headlines fetched", response);
          if(!response.data){
            throw new Error("Response Invalid");
          }
          if(!response.data.success){
            // Set the state to show no headlines available message
            setNoHeadlinesAvailable(true);
            setHeadlines([]);
          } else {
            setHeadlines(response.data.headlines);
          }
        } catch (e) {
          console.log(" [Fetch headline Error] ", e);
          flash("Fetch headline Error", { variant: "error" });
          setNoHeadlinesAvailable(true);
          setHeadlines([]);
        }
      }
    };
    fetchHeadlines();
  }, [currentHeadlineDate, flash]);



  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Headlines</h1>
        
        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {date ? format(date, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {noHeadlinesAvailable ? (
        <motion.div 
          className="bg-black text-white border border-gray-700 shadow-lg rounded-lg p-8 text-center mx-auto max-w-md sm:max-w-lg md:max-w-2xl"
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
          whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          whileTap={{ scale: 0.98 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
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
              No Headlines Available
            </motion.h2>
            <motion.p 
              className="text-gray-300 text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              There are no headlines available for{" "}
              <motion.span 
                className="font-semibold text-blue-400"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {date ? format(date, "MMMM d, yyyy") : "the selected date"}
              </motion.span>.
            </motion.p>
            <motion.p
              className="mt-4 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Please try selecting a different date.
            </motion.p>
          </motion.div>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {headlines.map((match: MatchHeadline, index) => (
            <HeadlinesCard key={index} match={match} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Headlines;