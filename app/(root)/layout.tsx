import Navbar from "@/components/Navbar.component";
import React, { Fragment } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <div className="nav-cont flex flex-row justify-center">
        <Navbar />
      </div>
      <div className="h-full">{children}</div>
    </Fragment>
  );
}
