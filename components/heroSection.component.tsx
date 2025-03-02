import { Fragment } from "react";
import { rubik } from "../styles/fonts";

const HeroSection = () => {
  return (
    <Fragment>
      <div className="container max-w-full bg-[url('/images.webp')] bg-cover bg-left dark:bg-[url('/nightbg.jpg')]  rounded-bl-3xl rounded-br-3xl">
        <div
          className="hero-container relative rounded-bl-3xl rounded-br-3xl bg-no-repeat bg-cover"
          style={{ backgroundImage: "url('/bg-1.png')", height: "100vh" }}
        >
          <img
            src="/herobg1.png"
            className="hero-img absolute hidden md:block rounded-bl-xl rounded-br-xl"
            style={{ top: "10%", right: "15%", width: "60vh" }}
          />
          <div
            className={`${rubik.className} text-container absolute hidden md:block`}
            style={{ width: "37%", top: "35%", left: "5%" }}
          >
            <h1 className="text-bold dark:text-yellow-400 text-6xl ">
              Your Ultimate IPL Fan Experience Hub
            </h1>
            <p
              className="text-bold dark:text-yellow-300 text-xl mt-10"
              style={{ width: "70%" }}
            >
              Join thousands of IPL fans in making real-time predictions,
              unlocking rewards, and earning achievements.
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default HeroSection;