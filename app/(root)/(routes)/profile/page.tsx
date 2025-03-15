/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { UserProfile } from "@/components/profile-page.component"

// import { UserProfile } from "./user-profile.component"

export default function ProfilePage() {
  
  return (
    <div className="min-h-screen w-full bg-background pt-20">
      <div className="container py-6 px-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>
        
        <UserProfile />
      </div>
    </div>
  )
}