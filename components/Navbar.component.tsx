"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ThemeToggle.component";
import Logo from "./Logo.component";
import { useDrawerContext } from "@/context/DrawerContext";

const Navbar = () => {
  const {setIsOpen , isOpen} = useDrawerContext();
  const handleDrawer = () => {
    console.log("Clicked " , isOpen)
    setIsOpen(true);
    console.log("After Clicked " , isOpen)
  }

  return (
    <Card
      className="container absolute bg-transparent top-0 py-3 px-4 border-0 flex items-center justify-between gap-6 rounded-2xl mt-5 z-5 dark:text-yellow-400 text-black  "
      style={{ zIndex: "1000" }}
    >
      <div className="img-wrapper ml-4">
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

      <div className="flex items-center">
        <ModeToggle />
        <Button variant="secondary" className="hidden md:block px-2 ml-3" onClick={handleDrawer}>
          Login
        </Button>
        <Button className="hidden md:block ml-2 mr-2">Get Started</Button>

        <div className="flex md:hidden mr-2 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5 rotate-0 scale-100" />
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
              <DropdownMenuItem>
                <Button variant="secondary" className="w-full text-sm" onClick={handleDrawer}>
                  Login
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button className="w-full text-sm">Get Started</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default Navbar;
