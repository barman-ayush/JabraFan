/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Navbar from "@/components/Navbar.component";
import { useUserContext } from "@/context/UserContext";
import React, { Fragment, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { useFlash } from "@/components/Flash.component";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, setUserData } = useUserContext();
  const { flash } = useFlash(); // Get the flash function from your hook
  const searchParams = useSearchParams(); // Get search parameters from URL

  const parseData = async () => {
    const response = await (
      await fetch("/api/auth/parsecookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    ).json();
    if (!response.success) return;
    setUserData(response.userData);
  };

  useEffect(() => {
    if (!userData) {
      parseData();
    }
  }, [userData, setUserData]);

  // Check for isUnauthorized parameter in URL and show flash message
  useEffect(() => {
    const isUnauthorized = searchParams.get("isUnauthorized");

    if (isUnauthorized === "true") {
      flash("You aren't an admin", { variant: "error" });

      // Optionally: Clean up the URL without causing a page refresh
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("isUnauthorized");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [searchParams, flash]);

  return (
    <Fragment>
      <div className="nav-cont flex flex-row justify-center">
        <Navbar />
      </div>
      <div className="h-full">
        <Suspense fallback={<div>Loading ...</div>}>
          {children}
        </Suspense>
      </div>
    </Fragment>
  );
}
