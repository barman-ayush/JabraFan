import { Fragment } from "react";
import LImage from "./Image.component";
import { LeaderCard } from "./LeaderCard.component";
const LeaderBoard = () => {
  return (
    <Fragment>
      <div className="leader-boad-container w-full text-center my-16 dark:text-dark-primary">
        <h1 className="text-bold text-6xl max-w-full">Leaderboard</h1>
        <div className="cards-container w-full flex flex-row flex-wrap justify-center gap-16 mt-16">
          <div className="wrap md:mt-16">
            <LeaderCard />
          </div>
          <div className="wrap md:mb-16">
            <LeaderCard />
          </div>
          <div className="wrap md:mt-16">
            <LeaderCard />
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default LeaderBoard;
