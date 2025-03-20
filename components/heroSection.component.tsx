"use client";
import { Fragment } from "react";
import { rubik } from "../styles/fonts";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const HeroSection = () => {
  const router = useRouter();
  const redirect = (redirectTo: string) => {
    router.push(redirectTo);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      }
    }
  };

  // Staggered text animation
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <Fragment>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container max-w-full bg-[url('/images.webp')] bg-cover bg-center dark:bg-[url('/nightbg.jpg')] rounded-bl-3xl rounded-br-3xl"
      >
        <div
          className="hero-container relative rounded-bl-3xl rounded-br-3xl bg-no-repeat bg-cover flex flex-col items-center justify-center"
          style={{
            backgroundImage: "url('/images/bg.png')",
            backgroundSize: "100% 100%",
            minHeight: "90vh",
            height: "auto",
          }}
        >
          {/* Semi-transparent overlay with animated reveal */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute inset-0 bg-black rounded-bl-3xl rounded-br-3xl"
          ></motion.div>

          {/* Text container with staggered animation - centered */}
          <motion.div
            className={`${rubik.className} text-container px-6 py-8 text-center z-10 relative max-w-4xl mx-auto`}
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-bold text-white dark:text-yellow-400 drop-shadow-lg shadow-black text-4xl md:text-5xl lg:text-6xl"
              variants={fadeIn}
            >
              Your Ultimate IPL Fan Experience Hub
            </motion.h1>
            <motion.p
              className="text-bold text-white dark:text-yellow-300 drop-shadow-md shadow-black text-lg md:text-xl mt-6 md:mt-10 mx-auto"
              style={{ maxWidth: "700px" }}
              variants={fadeIn}
            >
              Join thousands of IPL fans in making real-time predictions,
              unlocking rewards, and earning achievements.
            </motion.p>
            
            <motion.div 
              variants={fadeIn}
              whileHover="hover"
              whileTap="tap"
              initial="initial"
              className="mt-8 md:mt-10"
            >
              <Button
                onClick={() => {
                  redirect("matches");
                }}
                className="bg-yellow-500 hover:bg-yellow-400 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-black font-bold px-8 py-6 text-lg rounded-full transition-colors"
              >
                Get Started
              </Button>
            </motion.div>
            
            {/* Animated decorative elements */}
            <motion.div 
              className="absolute -bottom-16 left-1/4 w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 blur-xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ delay: 1, duration: 1 }}
            />
            
            <motion.div 
              className="absolute -top-20 right-1/4 w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-500/10 blur-xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
            />
          </motion.div>
        </div>
      </motion.div>
    </Fragment>
  );
};

export default HeroSection;