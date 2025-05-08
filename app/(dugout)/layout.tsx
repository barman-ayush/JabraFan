"use client";
import Logo from "@/components/Logo.component";
import DugoutNavbar from "@/components/dugout-navbar.comonent";
import { DugoutSidebar } from "@/components/dugout-sidebar.component";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react"; // Import the Menu (hamburger) icon
import React, { Fragment, Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <SidebarProvider>
        <div className="flex flex-col min-w-full">
          <DugoutNavbar />
          <div className="flex flex-1 w-full">
            <div className="sidebar-container h-[calc(100vh-64px)] sticky top-16 hidden md:block">
              <DugoutSidebar />
            </div>
            <main className="flex-1 p-4">
              <Suspense fallback={<div>Loading ...</div>}>{children}</Suspense>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </Fragment>
  );
}
