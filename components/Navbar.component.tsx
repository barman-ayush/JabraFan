import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
//   import ShadcnKit from "@/components/icons/shadcn-kit";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import Link from "next/link";
import { ModeToggle } from "./ThemeToggle.component";
import Logo from "./Logo.component";
import { DrawerWrapper } from "./drawer.component";

const Navbar = () => {
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
          <a href="#home">Home</a>
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
        <DrawerWrapper>
          <Button variant="secondary" className="hidden md:block px-2 ml-3">
            Login
          </Button>
        </DrawerWrapper>
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
                <a href="#home">Home</a>
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
                <DrawerWrapper>
                  <Button variant="secondary" className="w-full text-sm">
                    Login
                  </Button>
                </DrawerWrapper>
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
