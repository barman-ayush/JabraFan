"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "./Logo.component";
import { useDrawerContext } from "@/context/DrawerContext";
import { useUserContext } from "@/context/UserContext";
import { useCallback, useEffect, useState, useRef } from "react";
import { ProfileButton } from "./ProfileButton.component";
import { Coins, Wallet, Menu } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { navigators } from "@/utils/navigators";
import { NavigatorItemProps } from "@/utils/types";

const Navbar = () => {
  const { setIsOpen } = useDrawerContext();
  const { userData, setUserData } = useUserContext();
  const [prevCredits, setPrevCredits] = useState(userData?.credits || 0);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const creditsContainerRef = useRef(null);

  useEffect(() => {
    const parseData = async () => {
      const response = await (
        await fetch("/api/auth/parsecookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      ).json();
      if (!response.success) return;
      console.log(" RESPONSE_DATA : ", response);
      setUserData(response.userData);
    };

    if (!userData) {
      parseData();
    }
  }, [setUserData]);

  const handleDrawer = useCallback(() => {
    console.log("Opening Drawer");
    setIsOpen(true);
  }, [setIsOpen]);

  // Compare previous and current credit values
  useEffect(() => {
    // Safe access to userData and credits with fallback
    const currentCredits = userData?.credits || 0;

    if (currentCredits > prevCredits && prevCredits !== 0) {
      setShowCoinAnimation(true);

      // Hide animation after it completes
      const timer = setTimeout(() => {
        setShowCoinAnimation(false);
      }, 2000);

      return () => clearTimeout(timer);
    }

    setPrevCredits(currentCredits);
    // Include userData in dependencies
  }, [userData, prevCredits]);

  // Function to generate random coin animations
  const renderCoins = () => {
    if (!showCoinAnimation) return null;

    const currentCredits = userData?.credits || 0;
    const coinCount = Math.min(10, currentCredits - prevCredits || 5);
    const coins = [];

    for (let i = 0; i < coinCount; i++) {
      coins.push(
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * 40 - 20,
            y: 0,
            opacity: 1,
            scale: Math.random() * 0.4 + 0.8,
          }}
          animate={{
            y: -100 - Math.random() * 50,
            x: Math.random() * 100 - 50,
            opacity: 0,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 1 + Math.random(),
            ease: "easeOut",
          }}
          style={{ zIndex: 1010 }}
        >
          <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold border-2 border-yellow-500">
            <Coins size={14} className="text-yellow-700" />
          </div>
        </motion.div>
      );
    }

    return coins;
  };

  return (
    <Card
      className="container absolute bg-transparent top-0 px-4 border-0 flex items-center justify-between gap-6 rounded-2xl mt-5 z-50 w-full max-w-full"
      style={{ zIndex: "1000" }}
    >
      <div className="img-wrapper">
        <Logo />
      </div>

      <ul className="hidden md:flex items-center pr-12 gap-10 text-indigo-700 dark:text-yellow-400 drop-shadow-md">
        {navigators.map((item: NavigatorItemProps, index: number) => (
          <li
            key={index}
            className="font-medium hover:text-indigo-500 dark:hover:text-yellow-300 transition-colors"
          >
            <Link href={item.url}>{item.title}</Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2">
        {userData ? (
          <>
            {/* Desktop view for wallet info */}
            <div className="hidden md:flex items-center gap-3">
              <div
                ref={creditsContainerRef}
                className="relative flex items-center gap-1 bg-indigo-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded-full shadow-sm overflow-visible"
              >
                <Coins
                  size={16}
                  className="text-indigo-600 dark:text-yellow-400"
                />

                {/* Credits counter with animation */}
                <motion.span
                  key={userData?.credits}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="font-medium text-indigo-700 dark:text-yellow-400"
                >
                  {userData?.credits || 0} Credits
                </motion.span>

                {/* Animated coins container */}
                <AnimatePresence>{renderCoins()}</AnimatePresence>
              </div>

              <div className="flex items-center gap-1 bg-purple-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full shadow-sm">
                <Wallet
                  size={16}
                  className="text-purple-600 dark:text-green-400"
                />
                <span className="font-medium text-purple-700 dark:text-green-400">
                  ₹{userData?.winnings || 0}
                </span>
              </div>
            </div>

            {/* Mobile view for wallet info */}
            <div className="md:hidden flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="mr-2 bg-white/90 dark:bg-transparent border-indigo-300 dark:border-yellow-400"
                  >
                    <Wallet className="h-5 w-5 text-indigo-600 dark:text-yellow-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="flex justify-between relative overflow-visible">
                    <span className="flex items-center gap-2">
                      <Coins
                        size={16}
                        className="text-indigo-600 dark:text-yellow-600"
                      />
                      Credits
                    </span>
                    <motion.span
                      key={userData?.credits}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="font-bold"
                    >
                      {userData?.credits || 0}
                    </motion.span>
                    <AnimatePresence>
                      {showCoinAnimation && renderCoins()}
                    </AnimatePresence>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Wallet
                        size={16}
                        className="text-purple-600 dark:text-green-600"
                      />
                      Cash
                    </span>
                    <span className="font-bold">
                      ₹{userData?.winnings || 0}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <ProfileButton />
          </>
        ) : (
          <>
            <Button
              variant="default"
              className="hidden md:block bg-indigo-600 hover:bg-indigo-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white dark:text-black font-bold"
              onClick={handleDrawer}
            >
              Login
            </Button>
            <Button
              variant="default"
              className="md:hidden bg-indigo-600 hover:bg-indigo-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white dark:text-black font-bold"
              size="sm"
              onClick={handleDrawer}
            >
              Login
            </Button>
          </>
        )}

        {/* Mobile menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/90 dark:bg-transparent border-indigo-300 dark:border-yellow-400"
              >
                <Menu className="h-5 w-5 text-indigo-600 dark:text-yellow-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navigators.map((item: NavigatorItemProps, index: number) => (
                <DropdownMenuItem>
                  <Link key={index} href={item.url} className="w-full">
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default Navbar;
