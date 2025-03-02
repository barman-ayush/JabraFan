"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function ProfileButton() {
  const { userData, setUserData } = useUserContext();
  const router = useRouter();

  return (
    <div className="cont hover:cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="ml-4">
            {userData?.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <a href="/">Home</a>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {router.push("/profile")}}>
            <a >Profile</a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a href="#pricing">Pricing</a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a href="#faqs">FAQs</a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            {userData ? (
              <Button
                variant="secondary"
                className="px-2 ml-3 mx-4"
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="w-full text-sm mx-4"
              >
                Login
              </Button>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button className="w-full text-sm">Get Started</Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
