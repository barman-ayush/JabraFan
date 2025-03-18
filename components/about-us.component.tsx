import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const AboutUsSection = () => {
  return (
    <div className="w-full">
      {/* About Us Heading - Outside background image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
          About Us
        </h1>
      </div>

      {/* Main Content with Background Image */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 bg-cover bg-center bg-no-repeat rounded-lg"
        style={{ backgroundImage: "url('/aboutus.jpg')" }}
      >
        {/* Mission Statement / About Us - with semi-transparent background for readability */}
        <div className="text-center mb-16 max-w-4xl mx-auto bg-white/30 backdrop-blur-sm p-6 rounded-lg">
          <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed font-medium">
            At JabraFan, we&apos;re more than just fans – we&apos;re a community of
            passionate IPL enthusiasts dedicated to bringing you closer to the
            game you love. Founded with the vision of creating a vibrant space
            for IPL superfans, our platform is built on the excitement, thrill,
            and camaraderie that cricket inspires
          </p>
        </div>

        {/* "We stand for" Section - with updated color */}
        <div className="mb-14 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-md">
            We stand for!!
          </h2>
        </div>

        {/* Features Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Passion for IPL Card - with transparent background */}
          <Card className="bg-black/70 border-0 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 md:p-10">
              <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6 text-white">
                Passion for IPL
              </h3>
              <p className="text-gray-200 text-center text-base sm:text-lg">
                We live and breathe cricket, just like you. Our platform is
                designed to fuel your love for the game
              </p>
            </CardContent>
          </Card>

          {/* Engagement Card - with transparent background */}
          <Card className="bg-black/70 border-0 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 md:p-10">
              <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6 text-white">
                Engagement and Excitement
              </h3>
              <p className="text-gray-200 text-center text-base sm:text-lg">
                From badges to leaderboards to exclusive rewards, platform is
                designed to enhance your IPL journey, keeping the fun alive long
                after the matches are over
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSection;