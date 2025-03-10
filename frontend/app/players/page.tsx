"use client"

import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayerCard } from "@/components/player-card"
import { PlayerStats } from "@/components/player-stats"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// Simple fetcher for SWR.
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Example TypeScript interface for your Player data.
interface Player {
  id?: number
  name: string
  image?: string
  team: string
  position: string
  number?: string
  isGoalie?: boolean
  stats?: {
    gp?: number
    g?: number
    a?: number
    pts?: number
    w?: number
    l?: number
    sv?: number
  }
}

export default function PlayersPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="NHL Players"
        text="Browse the top players in the NHL by position."
      />

      {/* Top Players Section */}
      <Tabs defaultValue="top" className="space-y-4">
        <TabsList>
          <TabsTrigger value="top">Top Players</TabsTrigger>
          <TabsTrigger value="forwards">Forwards</TabsTrigger>
          <TabsTrigger value="defensemen">Defensemen</TabsTrigger>
          <TabsTrigger value="goalies">Goalies</TabsTrigger>
        </TabsList>

        {/* Top Players Tab */}
        <TabsContent value="top" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top NHL Players by Points</CardTitle>
              <CardDescription>
                Leading players in the NHL ranked by total points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlayerStats />
            </CardContent>
          </Card>
          <TopPlayersTab endpoint="/players/top" />
        </TabsContent>

        {/* Forwards Tab */}
        <TabsContent value="forwards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top NHL Forwards</CardTitle>
              <CardDescription>Leading forwards in the NHL</CardDescription>
            </CardHeader>
            <CardContent>
              <TopPlayersTab endpoint="/players/forwards" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Defensemen Tab */}
        <TabsContent value="defensemen" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top NHL Defensemen</CardTitle>
              <CardDescription>Leading defensemen in the NHL</CardDescription>
            </CardHeader>
            <CardContent>
              <TopPlayersTab endpoint="/players/defensemen" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goalies Tab */}
        <TabsContent value="goalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top NHL Goalies</CardTitle>
              <CardDescription>Leading goaltenders in the NHL</CardDescription>
            </CardHeader>
            <CardContent>
              <TopPlayersTab endpoint="/players/goalies" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

function TopPlayersTab({ endpoint }: { endpoint: string }) {
  const { data, error, isValidating } = useSWR(
    `http://localhost:8000${endpoint}`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  )

  const players: Player[] = data?.players ?? []

  if (error)
    return <p className="text-red-500 text-center">Error loading data.</p>
  if (isValidating)
    return (
      <div className="space-y-4">
        <Skeleton className="h-[125px] w-full rounded-lg" />
        <Skeleton className="h-[125px] w-full rounded-lg" />
      </div>
    )

  return players.length > 0 ? (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {players.map((player) => (
        <PlayerCard
          key={player.id || player.name}
          name={player.name}
          image={player.image ?? "/placeholder.svg?height=150&width=150"}
          team={player.team}
          position={player.position}
          number={player.number || ""}
          stats={player.stats || {}}
          isGoalie={player.isGoalie}
        />
      ))}
    </div>
  ) : (
    <p className="text-center text-muted-foreground">No players found.</p>
  )
}
