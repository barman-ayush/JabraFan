import { Dispatch, Fragment, SetStateAction } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

type DatePickerTeamChangesProps = {
    selectedDate : Date | undefined;
    setSelectedDate : Dispatch<SetStateAction<Date | undefined>>

}


const DatePickerTeamChanges = ({selectedDate , setSelectedDate} : DatePickerTeamChangesProps) => {
  return (
    <Fragment>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full md:w-auto flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            <CalendarIcon className="h-4 w-4 text-blue-400" />
            {selectedDate ? format(selectedDate, "PPP") : "Select match date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            initialFocus
            className="bg-gray-800 text-white"
          />
          {selectedDate && (
            <div className="p-2 border-t border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-white hover:bg-gray-700"
                onClick={() => setSelectedDate(undefined)}
              >
                Reset
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </Fragment>
  );
};
export default DatePickerTeamChanges;
