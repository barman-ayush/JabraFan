"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ThemeToggle.component";
import Logo from "./Logo.component";
import { useDrawerContext } from "@/context/DrawerContext";
import { useUserContext } from "@/context/UserContext";
import { useCallback } from "react";
import { ProfileButton } from "./ProfileButton.component";
import { useRouter } from "next/navigation";
import { Coins, Wallet, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { setIsOpen } = useDrawerContext();
  const { userData } = useUserContext();
  const router = useRouter();

  const handleDrawer = useCallback(() => {
    console.log("Opening Drawer");
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <Card
      className="container absolute bg-transparent top-0 py-3 px-4 border-0 flex items-center justify-between gap-6 rounded-2xl mt-5 z-5 dark:text-yellow-400 text-black w-full max-w-full"
      style={{ zIndex: "1000" }}
    >
      <div className="img-wrapper">
        <Logo />
      </div>
      
      <ul className="hidden dark:text-yellow-400 md:flex items-center gap-10 text-card-foreground">
        <li className="font-medium">
          <a href="/">Home</a>
        </li>
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#pricing">Pricing</a>
        </li>
        <li>
          <a href="#faqs">FAQs</a>
        </li>
      </ul>

      <div className="flex items-center gap-2">
        {userData ? (
          <>
            {/* Desktop view for wallet info */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded-full">
                <Coins size={16} className="text-yellow-600 dark:text-yellow-400" />
                <span className="font-medium">{userData?.credits || 0} Credits</span>
              </div>
              
              <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
                <Wallet size={16} className="text-green-600 dark:text-green-400" />
                <span className="font-medium">₹{userData?.credits || 0}</span>
              </div>
            </div>
            
            {/* Mobile view for wallet info */}
            <div className="md:hidden flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="mr-2">
                    <Wallet className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Coins size={16} className="text-yellow-600" />
                      Credits
                    </span>
                    <span className="font-bold">{userData?.credits || 0}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Wallet size={16} className="text-green-600" />
                      Cash
                    </span>
                    <span className="font-bold">₹{userData?.credits || 0}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <ProfileButton />
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              className="hidden md:block"
              onClick={handleDrawer}
            >
              Login
            </Button>
            <Button
              variant="secondary"
              className="md:hidden"
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
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <a href="/">Home</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#features">Features</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#pricing">Pricing</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#faqs">FAQs</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default Navbar;