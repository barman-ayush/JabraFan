"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal } from "lucide-react"

// Define the user type
interface User {
  id: string
  username: string
  credits: number
  avatarUrl: string
}

// Sample data - replace with your actual data source
const sampleUsers: User[] = [
  {
    id: "1",
    username: "AlexGamer",
    credits: 8750,
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    username: "SamChampion",
    credits: 9200,
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    username: "TaylorWins",
    credits: 7800,
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
]

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState<User[]>([])

  useEffect(() => {
    // Sort users by credits in descending order and take top 3
    const sortedUsers = [...sampleUsers].sort((a, b) => b.credits - a.credits).slice(0, 3)
    setTopUsers(sortedUsers)
  }, [])

  // Determine podium order (2nd, 1st, 3rd)
  const podiumOrder = topUsers.length === 3 ? [topUsers[1], topUsers[0], topUsers[2]] : topUsers

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Join the chase! Track your rank and challenge the fan community
        </h2>
        <p className="text-muted-foreground">Compete with others and climb to the top of the leaderboard</p>
      </div>

      {/* Podium Section */}
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-end w-full gap-4 mb-8">
          {podiumOrder.map((user, index) => {
            // Determine position (0 = 2nd, 1 = 1st, 2 = 3rd)
            const position = index === 0 ? 2 : index === 1 ? 1 : 3
            const podiumHeight = position === 1 ? "h-40" : position === 2 ? "h-32" : "h-24"
            const delay = position === 1 ? 0.2 : position === 2 ? 0 : 0.4

            return (
              <motion.div
                key={user.id}
                className={`flex flex-col items-center`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay }}
              >
                <motion.div
                  className="relative mb-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Avatar
                    className={`w-16 h-16 md:w-20 md:h-20 ${position === 1 ? "ring-4 ring-primary" : ""} border-2 border-background`}
                  >
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
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

                <p className="font-medium text-sm md:text-base">{user.username}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{user.credits.toLocaleString()} credits</p>

                {/* Podium */}
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
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Top Users Cards - Mobile Friendly Alternative */}
      <div className="mt-8 md:hidden space-y-3">
        {topUsers.map((user, index) => (
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
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
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
                  <p className="font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.credits.toLocaleString()} credits</p>
                </div>
                <div className="font-bold text-lg">#{index + 1}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

