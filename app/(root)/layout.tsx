import Navbar from "@/components/Navbar.component";
import React, { Fragment } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <Navbar />
      <div className="h-full border-red-700 border-solid border-2 ">
        {children}
      </div>
    </Fragment>
  );
}
