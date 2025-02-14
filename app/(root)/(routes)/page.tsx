import LeaderBoard from "@/components/LeaderBoard.component";
import FooterSection from "@/components/footer.component";
import HeroSection from "@/components/heroSection.component";
import Rewards from "@/components/rewards.components";
import { Fragment } from "react";

const LandingPage = () => {
  return (
    <Fragment>
      <HeroSection />
      <LeaderBoard />
      <Rewards />
      <FooterSection />
    </Fragment>
  );
};

export default LandingPage;
