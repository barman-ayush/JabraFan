/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Navbar from "@/components/Navbar.component";
import { useUserContext } from "@/context/UserContext";
import React, { Fragment, useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { userData ,setUserData } = useUserContext();

  const parseData = async() => {
    const response = await (await fetch("/api/auth/parsecookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })).json();
    if(!response.success) return;
    setUserData(response.userData);
  }

  useEffect(() => {
    if(!userData){
      parseData()
    }
  } , []);
  return (
    <Fragment>
      <div className="nav-cont flex flex-row justify-center">
        <Navbar />
      </div>
      <div className="h-full">{children}</div>
    </Fragment>
  );
}
