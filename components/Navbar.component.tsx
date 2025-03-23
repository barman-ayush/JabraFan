"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "./Logo.component";
import { useDrawerContext } from "@/context/DrawerContext";
import { useUserContext } from "@/context/UserContext";
import { useCallback } from "react";
import { ProfileButton } from "./ProfileButton.component";
import { Coins, Wallet, Menu } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { setIsOpen } = useDrawerContext();
  const { userData } = useUserContext();

  const handleDrawer = useCallback(() => {
    console.log("Opening Drawer");
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <Card
      className="container absolute bg-transparent top-0 px-4 border-0 flex items-center justify-between gap-6 rounded-2xl mt-5 z-50 w-full max-w-full"
      style={{ zIndex: "1000" }}
    >
      <div className="img-wrapper">
        <Logo />
      </div>

      <ul className="hidden md:flex items-center pr-12 gap-10 text-indigo-700 dark:text-yellow-400 drop-shadow-md">
        <li className="font-medium hover:text-indigo-500 dark:hover:text-yellow-300 transition-colors">
          <Link href="/">Home</Link>
        </li>
        <li className="hover:text-indigo-500 dark:hover:text-yellow-300 transition-colors">
          <Link href="/matches">Matches</Link>
        </li>
        <li className="hover:text-indigo-500 dark:hover:text-yellow-300 transition-colors">
          <Link href="/admin">Admin</Link>
        </li>
      </ul>
      <div className="flex items-center gap-2">
        {userData ? (
          <>
            {/* Desktop view for wallet info */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1 bg-indigo-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded-full shadow-sm">
                <Coins
                  size={16}
                  className="text-indigo-600 dark:text-yellow-400"
                />
                <span className="font-medium text-indigo-700 dark:text-yellow-400">
                  {userData?.credits || 0} Credits
                </span>
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
                  <DropdownMenuItem className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Coins
                        size={16}
                        className="text-indigo-600 dark:text-yellow-600"
                      />
                      Credits
                    </span>
                    <span className="font-bold">{userData?.credits || 0}</span>
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
              <DropdownMenuItem>
                <Link href="/" className="w-full">
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/matches" className="w-full">
                  Matches
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/admin" className="w-full">
                  Admin
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default Navbar;
