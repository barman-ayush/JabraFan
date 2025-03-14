"use client"

import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { MatchesManagement } from "../components/matches-management.component"
import { RedeemRequests } from "../components/redeem-requests.component"
import { LiveMatches } from "../components/live-matches.component"
import { Trophy, Gift, Clock } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"matches" | "redeem" | "live">("matches")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <Sidebar variant="inset" className="border-r">
          <SidebarContent className="mt-28" >
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "matches"}
                  onClick={() => setActiveTab("matches")}
                  tooltip="Matches"
                >
                  <Trophy className="h-5 w-5" />
                  <span>Matches</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "live"}
                  onClick={() => setActiveTab("live")}
                  tooltip="Live Matches"
                >
                  <Clock className="h-5 w-5" />
                  <span>Live Matches</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "redeem"}
                  onClick={() => setActiveTab("redeem")}
                  tooltip="Redeem Requests"
                >
                  <Gift className="h-5 w-5" />
                  <span>Redeem Requests</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 overflow-auto bg-background h-full mt-28 w-full">
          <div className="container max-w-full py-6 h-full">
            <div className="flex items-center mb-6">
              <SidebarTrigger className="md:hidden mr-2" />
              <h1 className="text-2xl font-bold md:ml-20">Admin Dashboard</h1>
            </div>

            {activeTab === "matches" ? <MatchesManagement /> : 
             activeTab === "live" ? <LiveMatches /> : 
             <RedeemRequests />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}