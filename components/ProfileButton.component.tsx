"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";


export function ProfileButton() {
  const { userData } = useUserContext();
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
            <Link href="/">Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {router.push("/profile")}}>
            <Link href={"/profile"}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="#pricing">Pricing</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="#faqs">FAQs</Link>
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
