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

const Navbar = () => {
  const { setIsOpen } = useDrawerContext();
  const { userData } = useUserContext()
  const router = useRouter();

  // console.log(" [ USER_CONTEXT ] : ", userData);

  const handleDrawer = useCallback(() => {
    console.log("Opening Drawer");
    setIsOpen(true);
  }, [setIsOpen]);

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
        {/* <div className="mode hidden md:block">
          <ModeToggle />
        </div> */}
        {userData ? (
          <ProfileButton/>
        ) : (
          <Button
            variant="secondary"
            className="hidden md:block px-2 ml-3 mx-4"
            onClick={handleDrawer}
          >
            Login
          </Button>
        )}
        <Button className="hidden md:block ml-2 mr-2" onClick={() => { router.push("/matches") }} >Get Started</Button>
      </div>
    </Card>
  );
};

export default Navbar;
