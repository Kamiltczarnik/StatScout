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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

// Simple fetcher for SWR.
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// TypeScript interface for Player data.
interface Player {
  id?: number
  name?: string
  fullName?: string
  firstName?: string
  lastName?: string
  image?: string
  team?: string
  position?: string
  number?: string
  isGoalie?: boolean
  headshot?: string
  positionCode?: string
  sweaterNumber?: number
  shootsCatches?: string
  heightInInches?: number
  weightInPounds?: number
  birthDate?: string
  birthCity?: { default: string }
  birthCountry?: string
  birthStateProvince?: { default: string }
  category?: string
  stats?: {
    gp?: number
    g?: number
    a?: number
    pts?: number
    ppg?: number  // Points per game
    gwg?: number  // Game-winning goals
    w?: number
    l?: number
    otl?: number  // Overtime losses
    sv?: number
    gaa?: number  // Goals against average
    so?: number   // Shutouts
  }
}

// Cache for player data
let cachedData = {
  leaders: null,
  clutch: null,
  goalies: null,
  timestamp: 0
};

// Cache expiration in milliseconds (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

export default function PlayersPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="NHL Players"
        text="Browse the top players in the NHL across key categories."
      />

      {/* Top Players Section */}
      <Tabs defaultValue="leaders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leaders">Point Leaders</TabsTrigger>
          <TabsTrigger value="clutch">Clutch Players</TabsTrigger>
          <TabsTrigger value="goalies">Top Goalies</TabsTrigger>
        </TabsList>

        {/* Point Leaders Tab */}
        <TabsContent value="leaders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NHL Point Leaders</CardTitle>
              <CardDescription>Leading forwards in the NHL by total points</CardDescription>
            </CardHeader>
            <CardContent>
              {isMounted && <PointLeadersTab />}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clutch Players Tab */}
        <TabsContent value="clutch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NHL Clutch Players</CardTitle>
              <CardDescription>Leading skaters in the NHL by game-winning goals</CardDescription>
            </CardHeader>
            <CardContent>
              {isMounted && <ClutchPlayersTab />}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goalies Tab */}
        <TabsContent value="goalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top NHL Goalies</CardTitle>
              <CardDescription>Leading goaltenders in the NHL by wins and save percentage</CardDescription>
            </CardHeader>
            <CardContent>
              {isMounted && <TopGoaliesTab />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

function PointLeadersTab() {
  // Check if we have valid cached data
  const now = Date.now();
  const useCache = cachedData.leaders && (now - cachedData.timestamp < CACHE_EXPIRATION);
  
  // Only fetch if cache is invalid
  const { data, error, isValidating } = useSWR(
    useCache ? null : "http://localhost:8000/players/leaders",
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  // Update cache if we received new data
  if (data && data.players && !useCache) {
    cachedData.leaders = data.players;
    cachedData.timestamp = now;
  }

  // Use cached data if available
  const players: Player[] = useCache ? cachedData.leaders : data?.players ?? [];

  if (error)
    return <p className="text-red-500 text-center">Error loading player data.</p>
  if (isValidating && !useCache)
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    )

  return players.length > 0 ? (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {players.slice(0, 12).map((player, index) => (
        <PlayerCard
          key={player.id || index}
          name={player.fullName || `${player.firstName} ${player.lastName}` || "Unknown Player"}
          image={player.headshot || "/placeholder.svg?height=150&width=150"}
          team={player.team || ""}
          position={player.positionCode || player.position || "F"}
          number={player.sweaterNumber?.toString() || ""}
          stats={player.stats || {
            gp: 0,
            g: 0,
            a: 0,
            pts: 0
          }}
          isGoalie={false}
          showExtraStats={false}
        />
      ))}
    </div>
  ) : (
    <p className="text-center text-muted-foreground">No players found.</p>
  )
}

function ClutchPlayersTab() {
  // Check if we have valid cached data
  const now = Date.now();
  const useCache = cachedData.clutch && (now - cachedData.timestamp < CACHE_EXPIRATION);
  
  // Only fetch if cache is invalid
  const { data, error, isValidating } = useSWR(
    useCache ? null : "http://localhost:8000/players/clutch",
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  // Update cache if we received new data
  if (data && data.players && !useCache) {
    cachedData.clutch = data.players;
    cachedData.timestamp = now;
  }

  // Use cached data if available
  const players: Player[] = useCache ? cachedData.clutch : data?.players ?? [];

  if (error)
    return <p className="text-red-500 text-center">Error loading player data.</p>
  if (isValidating && !useCache)
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    )

  return players.length > 0 ? (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {players.slice(0, 12).map((player, index) => (
        <PlayerCard
          key={player.id || index}
          name={player.fullName || `${player.firstName} ${player.lastName}` || "Unknown Player"}
          image={player.headshot || "/placeholder.svg?height=150&width=150"}
          team={player.team || ""}
          position={player.positionCode || player.position || "F"}
          number={player.sweaterNumber?.toString() || ""}
          stats={player.stats || {
            gp: 0,
            g: 0,
            a: 0,
            pts: 0,
            gwg: 0
          }}
          isGoalie={false}
          showExtraStats={true}
        />
      ))}
    </div>
  ) : (
    <p className="text-center text-muted-foreground">No players found.</p>
  )
}

function TopGoaliesTab() {
  // Check if we have valid cached data
  const now = Date.now();
  const useCache = cachedData.goalies && (now - cachedData.timestamp < CACHE_EXPIRATION);
  
  // Only fetch if cache is invalid
  const { data, error, isValidating } = useSWR(
    useCache ? null : "http://localhost:8000/players/top/goalies",
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  // Update cache if we received new data
  if (data && data.goalies && !useCache) {
    cachedData.goalies = data.goalies;
    cachedData.timestamp = now;
  }

  // Use cached data if available
  const goalies: Player[] = useCache ? cachedData.goalies : data?.goalies ?? [];

  if (error)
    return <p className="text-red-500 text-center">Error loading goalies data.</p>
  if (isValidating && !useCache)
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    )

  return goalies.length > 0 ? (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {goalies.slice(0, 12).map((player, index) => (
        <PlayerCard
          key={player.id || index}
          name={player.fullName || `${player.firstName} ${player.lastName}` || "Unknown Player"}
          image={player.headshot || "/placeholder.svg?height=150&width=150"}
          team={player.team || ""}
          position={player.positionCode || player.position || "G"}
          number={player.sweaterNumber?.toString() || ""}
          stats={player.stats || {
            gp: 0,
            w: 0,
            l: 0,
            otl: 0,
            sv: 0,
            gaa: 0,
            so: 0
          }}
          isGoalie={true}
          showExtraStats={true}
        />
      ))}
    </div>
  ) : (
    <p className="text-center text-muted-foreground">No goalies found.</p>
  )
}
