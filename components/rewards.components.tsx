import { Fragment } from "react";
import { RewardsCard } from "./rewardsCard.component";
const Rewards = () => {
  return (
    <Fragment>
      <div className="rewards-container flex flex-col items-center">
        <h1 className="text-bold dark:text-yellow-400 text-6xl ">
          Our Rewards
        </h1>
        <div
          className="data-container flex flex-row gap-4 flex-wrap md:flex-nowrap mx-10 my-10"
          style={{ width: "70%" }}
        >
          <div className="text-container" style={{width : "100%"}}>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt
              iure neque in. Voluptates vel non id quas minus reiciendis quam,
              veritatis dolorem incidunt earum nesciunt eius. A dolores quasi
              nobis, nemo soluta temporibus beatae necessitatibus, expedita
              minima autem esse nam ducimus nesciunt, quidem magni veniam eius
              asperiores quaerat? Numquam, facere repudiandae blanditiis tempora
              nisi, libero sit nemo aliquid reprehenderit atque autem fuga
              laudantium est aspernatur!
            </p>
            <div className="card-container mt-10 flex flex-row flex-wrap justify-center items-center gap-y-10 gap-x-16">
              <RewardsCard />
              <RewardsCard />
              <RewardsCard />
              <RewardsCard />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Rewards;
