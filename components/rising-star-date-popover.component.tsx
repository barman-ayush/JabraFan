import { Dispatch, Fragment, SetStateAction } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { addWeeks, format, isSameDay, startOfWeek, subWeeks } from "date-fns";
import { motion } from "framer-motion";

type PopoverRisingStarProps = {
  formattedDateRange: string;
  setCurrentWeekStart: Dispatch<SetStateAction<Date>>;
  daysOfWeek: Date[];
};

const PopoverRisingStar = ({
  formattedDateRange,
  setCurrentWeekStart,
  daysOfWeek,
}: PopoverRisingStarProps) => {
  const today = new Date();
  // Navigate to previous week
  const gotoPreviousWeek = () => {
    setCurrentWeekStart((prevStart: Date) => subWeeks(prevStart, 1));
  };

  // Navigate to next week
  const gotoNextWeek = () => {
    setCurrentWeekStart((prevStart: Date) => addWeeks(prevStart, 1));
  };

  // Select today's week
  const gotoCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  return (
    <Fragment>
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
            {daysOfWeek.map((day: Date) => (
              <div key={day.toString()} className="text-center">
                <div className="text-xs text-gray-400 mb-1">
                  {format(day, "EEE")}
                </div>
                <motion.div
                  className={`text-sm p-2 rounded-full ${
                    isSameDay(day, today) ? "bg-blue-600" : "bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {format(day, "d")}
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
    </Fragment>
  );
};
export default PopoverRisingStar;
