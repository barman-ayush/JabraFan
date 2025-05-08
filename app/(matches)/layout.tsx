/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Navbar from "@/components/Navbar.component";
import React, { Fragment, Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <Fragment>
      <div className="nav-cont flex flex-row justify-center h-32">
        <Navbar />
      </div>
      <div>
        <Suspense fallback={<div>Loading ...</div>}>{children}</Suspense>
      </div>
    </Fragment>
  );
}
