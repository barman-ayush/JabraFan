import { Fragment } from "react";
import { Badge } from "./ui/badge";
import { Clock } from "lucide-react";
export const Upcoming = () => {
  return (
    <Fragment>
      <Badge
        variant="outline"
        className="flex items-center bg-purple-800 text-pink-100 border-purple-700"
      >
        <Clock className="mr-1 h-3 w-3" />
        Upcoming
      </Badge>
    </Fragment>
  );
};
export const Live = () => {
  return (
    <Fragment>
      <Badge
        variant="outline"
        className="bg-green-900 text-green-300 border-green-700 animate-pulse"
      >
        <Clock className="mr-1 h-3 w-3" />
        Live
      </Badge>
    </Fragment>
  );
};
export const Completed = () => {
  return (
    <Fragment>
      <Badge
        variant="secondary"
        className="bg-purple-800 text-pink-100 hover:bg-purple-700"
      >
        Completed
      </Badge>
    </Fragment>
  );
};
