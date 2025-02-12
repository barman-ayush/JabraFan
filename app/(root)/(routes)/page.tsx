import LeaderBoard from "@/components/LeaderBoard.component";
import HeroSection from "@/components/heroSection.component";
import Rewards from "@/components/rewards.components";
import { Fragment } from "react"

const LandingPage = () => {
    return <Fragment>
        <HeroSection/>
        <LeaderBoard/>
        <Rewards/>
        
    </Fragment>
}

export default LandingPage;