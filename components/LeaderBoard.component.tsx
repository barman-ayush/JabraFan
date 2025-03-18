"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import rank1 from "../public/Rank1.svg"
import rank2 from "../public/Rank1.svg"
import rank3 from "../public/Rank1.svg"

type Player = {
  id: number
  name: string
  score: number
  avatar: string
  country: string
  countryFlag: string
  position: number
  bgColor: string
}

export default function PodiumLeaderboard() {
  const players: Player[] = [
    {
      id: 1,
      name: "Davis Curtis",
      score: 2569,
      avatar: "/placeholder.svg?height=80&width=80",
      country: "USA",
      countryFlag: "🇺🇸",
      position: 1,
      bgColor: "hsl(var(--primary))"
    },
    {
      id: 2,
      name: "Alena Donin",
      score: 1469,
      avatar: "/placeholder.svg?height=80&width=80",
      country: "France",
      countryFlag: "🇫🇷",
      position: 2,
      bgColor: "hsl(var(--primary))"
    },
    {
      id: 3,
      name: "Craig Gouse",
      score: 1053,
      avatar: "/placeholder.svg?height=80&width=80",
      country: "Canada",
      countryFlag: "🇨🇦",
      position: 3,
      bgColor: "hsl(var(--primary))"
    },
  ]

  // Sort players by position
  const sortedPlayers = [...players].sort((a, b) => a.position - b.position)
  
  // Extract players by position for easier reference
  const firstPlace = sortedPlayers.find(p => p.position === 1)
  const secondPlace = sortedPlayers.find(p => p.position === 2)
  const thirdPlace = sortedPlayers.find(p => p.position === 3)

  if (!firstPlace || !secondPlace || !thirdPlace) {
    return <div>Missing player data</div>
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground p-4">
      {/* Timer Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge variant="outline" className="py-1.5 px-4 bg-card flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">06d 23h 00m</span>
        </Badge>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-md mx-auto">
          {/* Main Podium Container */}
          <div className="relative mt-40 md:mt-48">
            {/* Podium Platforms */}
            <div className="flex items-end justify-center space-x-2 md:space-x-4">
              {/* Second Place Podium */}
              <div className="flex flex-col items-center w-1/3">
                <div className="bg-primary/20 rounded-t-lg w-full h-32 md:h-40 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-bold text-primary">2</span>
                </div>
              </div>

              {/* First Place Podium */}
              <div className="flex flex-col items-center w-1/3">
                <div className="bg-primary/30 rounded-t-lg w-full h-40 md:h-52 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-bold text-primary">1</span>
                </div>
              </div>

              {/* Third Place Podium */}
              <div className="flex flex-col items-center w-1/3">
                <div className="bg-primary/10 rounded-t-lg w-full h-24 md:h-32 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-bold text-primary">3</span>
                </div>
              </div>
            </div>

            {/* Player Information (positioned above podiums) */}
            <div className="absolute -top-40 md:-top-44 left-0 right-0">
              <div className="flex justify-center items-start">
                {/* Second Place */}
                <div className={cn(
                  "flex flex-col items-center px-2 md:px-4",
                  "transform translate-y-8 md:translate-y-10"
                )}>
                  <div className="relative">
                    <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-background bg-muted">
                      <AvatarImage src={secondPlace.avatar} alt={secondPlace.name} />
                      <AvatarFallback>{secondPlace.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-card rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold border border-border">
                      {secondPlace.countryFlag}
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-center">{secondPlace.name}</p>
                  <Badge variant="secondary" className="mt-1">
                    {secondPlace.score.toLocaleString()} QP
                  </Badge>
                </div>

                {/* First Place */}
                <div className="flex flex-col items-center px-2 md:px-4 z-10">
                  <div className="relative">
                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
                      <Crown className="h-6 w-6 text-yellow-400" />
                    </div>
                    <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-yellow-400 bg-muted">
                      <AvatarImage src={firstPlace.avatar} alt={firstPlace.name} />
                      <AvatarFallback>{firstPlace.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-card rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold border border-border">
                      {firstPlace.countryFlag}
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-center">{firstPlace.name}</p>
                  <Badge variant="secondary" className="mt-1">
                    {firstPlace.score.toLocaleString()} QP
                  </Badge>
                </div>

                {/* Third Place */}
                <div className={cn(
                  "flex flex-col items-center px-2 md:px-4",
                  "transform translate-y-12 md:translate-y-16"
                )}>
                  <div className="relative">
                    <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-background bg-muted">
                      <AvatarImage src={thirdPlace.avatar} alt={thirdPlace.name} />
                      <AvatarFallback>{thirdPlace.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-card rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold border border-border">
                      {thirdPlace.countryFlag}
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-center">{thirdPlace.name}</p>
                  <Badge variant="secondary" className="mt-1">
                    {thirdPlace.score.toLocaleString()} QP
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}