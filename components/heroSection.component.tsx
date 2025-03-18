"use client";
import { Fragment } from "react";
import { rubik } from "../styles/fonts";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HeroSection = () => {
  const router = useRouter();
  const redirect = (redirectTo: string) => {
    router.push(redirectTo);
  };

  return (
    <Fragment>
      <div className="container max-w-full bg-[url('/images.webp')] bg-cover bg-center md:bg-left dark:bg-[url('/nightbg.jpg')] rounded-bl-3xl rounded-br-3xl">
        <div
          className="hero-container relative rounded-bl-3xl rounded-br-3xl bg-no-repeat bg-cover flex flex-col items-center md:block"
          style={{
            backgroundImage: "url('/bg-1.png')",
            minHeight: "90vh",
            height: "auto",
          }}
        >
          {/* Semi-transparent overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-bl-3xl rounded-br-3xl"></div>

          {/* Desktop image */}
          <div
            className="hidden md:block absolute z-10"
            style={{ top: "10%", right: "15%", width: "60vh" }}
          >
            <Image
              src="/herobg1.png"
              alt="IPL Fan Experience"
              width={600}
              height={600}
              className="hero-img rounded-bl-xl rounded-br-xl"
              priority
            />
          </div>

          {/* Mobile image - centered and smaller */}
          <div className="md:hidden w-full flex justify-center pt-20 pb-6 z-10 relative">
            <Image
              src="/herobg1.png"
              alt="IPL Fan Experience"
              width={300}
              height={300}
              className="hero-img rounded-xl"
              priority
            />
          </div>

          {/* Text container - full width on mobile, positioned on desktop */}
          <div
            className={`${rubik.className} text-container px-6 py-8 md:p-0 text-center md:text-left z-10 relative md:absolute`}
            style={{ maxWidth: "100%", top: "35%", marginLeft: "5%" }}
          >
            <h1 className="text-bold text-white dark:text-yellow-400 drop-shadow-lg shadow-black text-4xl md:text-5xl lg:text-6xl md:max-w-[70%] lg:max-w-[60%]">
              Your Ultimate IPL Fan Experience Hub
            </h1>
            <p
              className="text-bold text-white dark:text-yellow-300 drop-shadow-md shadow-black text-lg md:text-xl mt-6 md:mt-10 mx-auto md:mx-0"
              style={{ width: "100%", maxWidth: "500px" }}
            >
              Join thousands of IPL fans in making real-time predictions,
              unlocking rewards, and earning achievements.
            </p>
            <Button
              onClick={() => {
                redirect("matches");
              }}
              className="bg-yellow-500 hover:bg-yellow-400 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-black font-bold my-6 md:my-10 px-8 py-6 text-lg rounded-full hover:scale-105 transition-transform"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default HeroSection;
