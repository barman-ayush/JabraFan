/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import LeaderBoard from "@/components/LeaderBoard.component";
import FooterSection from "@/components/footer.component";
import HeroSection from "@/components/heroSection.component";
import Rewards from "@/components/rewards.components";
import { useDrawerContext } from "@/context/DrawerContext";
// import { useUserContext } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useRef } from "react";

const LandingPage = () => {
  const searchParams = useSearchParams();
  const { setIsOpen } = useDrawerContext();
  // const { userData } = useUserContext();
  const initialized = useRef(false);
  console.log("Landing page");

  const isLoginNeeded = searchParams.get("isLoginNeeded");

  useEffect(() => {
    if (!initialized.current && isLoginNeeded === "true") {
      initialized.current = true;
      setIsOpen(true);
    }
  }, [isLoginNeeded, setIsOpen]);

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