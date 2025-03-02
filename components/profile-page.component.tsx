"use client"

import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserProfile } from "./user-profile.component"
import { AccountDetails } from "./account-details.component"
import { User, CreditCard } from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "account">("profile")
  
  return (
    <SidebarProvider>
      {/* Added pt-20 to push all content below navbar */}
      <div className="flex min-h-screen w-full bg-background pt-20">
        {/* Added pt-5 to sidebar to prevent its content from overlapping */}
        <Sidebar variant="inset" className="border-r">
          {/* <SidebarHeader className="flex items-center justify-center py-6 " style={{paddingTop : "50%"}}>
            <h1 className="text-xl font-bold">My Account</h1>
          </SidebarHeader> */}
          <SidebarContent className="" style={{paddingTop : "35%"}}>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                  tooltip="Profile"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "account"}
                  onClick={() => setActiveTab("account")}
                  tooltip="Account"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Account Details</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        {/* Added px-4 for better spacing on the content side */}
        <div className="flex-1 overflow-auto w-full px-4" >
          <div className="container py-6 pr-0 md:pr-32">
            <div className="flex items-center mb-6">
              <SidebarTrigger className="md:hidden mr-2" />
              <h1 className="text-2xl font-bold">{activeTab === "profile" ? "My Profile" : "Account Details"}</h1>
            </div>
            
            {activeTab === "profile" ? <UserProfile /> : <AccountDetails />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}