/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal } from "lucide-react"

// Define the user type
interface User {
  id: string
  name: string
  credits: number
  avatarUrl?: string
}

// Placeholder users for empty positions
const placeholderUsers: User[] = [
  {
    id: "placeholder-1",
    name: "1st Place",
    credits: 0,
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "placeholder-2",
    name: "2nd Place",
    credits: 0,
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "placeholder-3",
    name: "3rd Place",
    credits: 0,
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
]

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/leaderboard')
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data')
        }
        
        const result = await response.json()
        
        if (result.success && result.data) {
          const users = result.data.map((user: any) => ({
            id: user.id,
            name: user.name,
            credits: user.credits,
            avatarUrl: "/placeholder.svg?height=100&width=100" // Default avatar
          }))
          
          // Fill missing positions with placeholders
          while (users.length < 3) {
            users.push(placeholderUsers[users.length])
          }
          
          setTopUsers(users)
        } else {
          setTopUsers(placeholderUsers)
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err)
        setError("Unable to load leaderboard data")
        setTopUsers(placeholderUsers)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  // Determine podium order (2nd, 1st, 3rd)
  const podiumOrder = topUsers.length === 3 ? [topUsers[1], topUsers[0], topUsers[2]] : topUsers

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-pulse text-center">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 mb-40">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Join the chase! Track your rank and challenge the fan community
        </h2>
        <p className="text-muted-foreground">Compete with others and climb to the top of the leaderboard</p>
      </div>

      {error && (
        <div className="text-center text-red-500 mb-4">
          {error}
        </div>
      )}

      {/* Podium Section */}
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-end w-full gap-6 md:gap-10 mb-12">
          {podiumOrder.map((user, index) => {
            // Determine position (0 = 2nd, 1 = 1st, 2 = 3rd)
            const position = index === 0 ? 2 : index === 1 ? 1 : 3
            const podiumHeight = position === 1 ? "h-40" : position === 2 ? "h-32" : "h-24"
            const delay = position === 1 ? 0.2 : position === 2 ? 0 : 0.4


            return (
              <motion.div
                key={user.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay }}
              >
                <motion.div
                  className={`relative mb-2`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Avatar
                    className={`w-16 h-16 md:w-20 md:h-20 ${position === 1 ? "ring-4 ring-primary" : ""} border-2 border-background`}
                  >
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  {/* Position indicator */}
                  <div className="absolute -top-2 -right-2 rounded-full bg-background p-1">
                    {position === 1 ? (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    ) : position === 2 ? (
                      <Medal className="h-5 w-5 text-gray-300" />
                    ) : (
                      <Medal className="h-5 w-5 text-amber-700" />
                    )}
                  </div>
                </motion.div>

                <p className="font-medium text-sm md:text-base">{user.name}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{user.credits.toLocaleString()} credits</p>

                {/* Podium */}
                {/* Podium */}
                <div className="relative">
                  <motion.div
                    className={`w-20 md:w-28 mt-2 rounded-t-md bg-primary/80 ${podiumHeight}`}
                    initial={{ height: 0 }}
                    animate={{ height: podiumHeight }}
                    transition={{ duration: 0.7, delay: delay + 0.3 }}
                  >
                    <div className="flex justify-center items-center h-8 font-bold text-primary-foreground">
                      #{position}
                    </div>
                  </motion.div>

                  {/* Podium stand with 3D effect */}
                  <motion.div
                    className="absolute w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: delay + 0.6 }}
                  >
                    {/* Top of podium */}
                    <div className="w-full h-1 bg-primary-foreground/20 rounded-t"></div>

                    {/* Front face with gradient */}
                    <div
                      className={`w-full ${podiumHeight} bg-gradient-to-b from-primary to-primary/60 rounded-b-md relative overflow-hidden`}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/5 to-transparent"></div>

                      {/* Horizontal lines for texture */}
                      <div className="absolute top-1/4 w-full h-px bg-primary-foreground/10"></div>
                      <div className="absolute top-2/4 w-full h-px bg-primary-foreground/10"></div>
                      <div className="absolute top-3/4 w-full h-px bg-primary-foreground/10"></div>

                      {/* Position number */}
                      <div className="absolute inset-0 flex justify-center items-center">
                        <span className="text-xl md:text-2xl font-bold text-primary-foreground/90">{position}</span>
                      </div>
                    </div>

                    {/* Bottom shadow */}
                    <div className="w-full h-2 bg-black/20 blur-sm rounded-full mx-auto -mt-1 transform scale-x-90"></div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Top Users Cards - Mobile Friendly Alternative */}
      {/* <div className="mt-8 md:hidden space-y-3">
        {topUsers.map((user, index) => {
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-background">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 rounded-full bg-background p-0.5">
                      {index === 0 ? (
                        <Trophy className="h-3 w-3 text-yellow-500" />
                      ) : index === 1 ? (
                        <Medal className="h-3 w-3 text-gray-300" />
                      ) : (
                        <Medal className="h-3 w-3 text-amber-700" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.credits.toLocaleString()} credits</p>
                  </div>
                  <div className="font-bold text-lg">#{index + 1}</div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })} */}
      {/* </div> */}
    </div>
  )
}