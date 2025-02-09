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
      {children}
    </Fragment>
  );
}
