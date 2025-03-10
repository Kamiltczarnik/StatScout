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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, TrendingUp } from "lucide-react"
import Image from "next/image"
import { teamLogos } from "@/lib/teamLogos"

function getTeamLogo(teamName: string): string {
  return teamLogos[teamName] || "/default-logo.svg"
}

interface BestOddsGame {
  game_id: string
  game_date: string // e.g. "2025-03-07"
  away_team: string
  home_team: string
  away_travel: number
  local_start_time?: string // e.g. "19:30"
}

// Helper function to filter duplicates (by game_id)
function filterDuplicates(
  nextPicks: BestOddsGame[] = [],
  scoutPicks: BestOddsGame[] = []
): BestOddsGame[] {
  return nextPicks.filter(
    (nextGame) => !scoutPicks.some((scoutGame) => scoutGame.game_id === nextGame.game_id)
  )
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ScoutPicksPage() {
  // Scout Picks (Back-to-Back) SWR hooks
  const {
    data: todayData,
    error: todayError,
    isValidating: todayLoading,
  } = useSWR("http://localhost:8000/best-odds/back-to-back/today", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const {
    data: tomorrowData,
    error: tomorrowError,
    isValidating: tomorrowLoading,
  } = useSWR("http://localhost:8000/best-odds/back-to-back/tomorrow", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const {
    data: futureData,
    error: futureError,
    isValidating: futureLoading,
  } = useSWR("http://localhost:8000/best-odds/back-to-back/future", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  // Next Best Picks SWR hooks
  const {
    data: nextTodayData,
    error: nextTodayError,
    isValidating: nextTodayLoading,
  } = useSWR("http://localhost:8000/next-best-odds/today", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const {
    data: nextTomorrowData,
    error: nextTomorrowError,
    isValidating: nextTomorrowLoading,
  } = useSWR("http://localhost:8000/next-best-odds/tomorrow", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const {
    data: nextFutureData,
    error: nextFutureError,
    isValidating: nextFutureLoading,
  } = useSWR("http://localhost:8000/next-best-odds/future", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Scout Picks"
        text="Recommended picks based on team travel fatigue analysis."
      />

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>How Scout Picks Work</AlertTitle>
        <AlertDescription>
          Our algorithm analyzes team travel distances and identifies games where the away team may be at a disadvantage due to travel fatigue. The home team is recommended as the pick in these matchups.
        </AlertDescription>
      </Alert>

      {/* Scout Picks Section */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today's Picks</TabsTrigger>
          <TabsTrigger value="tomorrow">Tomorrow's Picks</TabsTrigger>
          <TabsTrigger value="future">Upcoming Week</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Scout Picks</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayError ? (
                <div className="text-center py-8 text-muted-foreground">
                  Error loading today's picks.
                </div>
              ) : todayLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[125px] w-full rounded-lg" />
                  <Skeleton className="h-[125px] w-full rounded-lg" />
                </div>
              ) : todayData.best_odds_matchups_today?.length ? (
                <div className="space-y-4">
                  {todayData.best_odds_matchups_today.map((game: BestOddsGame) => (
                    <GamePickCard key={game.game_id} game={game} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No picks available for today.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tomorrow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tomorrow's Scout Picks</CardTitle>
              <CardDescription>
                {new Date(Date.now() + 86400000).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tomorrowError ? (
                <div className="text-center py-8 text-muted-foreground">
                  Error loading tomorrow's picks.
                </div>
              ) : tomorrowLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[125px] w-full rounded-lg" />
                  <Skeleton className="h-[125px] w-full rounded-lg" />
                </div>
              ) : tomorrowData.best_odds_matchups_tomorrow?.length ? (
                <div className="space-y-4">
                  {tomorrowData.best_odds_matchups_tomorrow.map((game: BestOddsGame) => (
                    <GamePickCard key={game.game_id} game={game} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No picks available for tomorrow.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="future" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Week's Scout Picks</CardTitle>
              <CardDescription>Best picks for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {futureError ? (
                <div className="text-center py-8 text-muted-foreground">
                  Error loading upcoming picks.
                </div>
              ) : futureLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[125px] w-full rounded-lg" />
                  <Skeleton className="h-[125px] w-full rounded-lg" />
                  <Skeleton className="h-[125px] w-full rounded-lg" />
                </div>
              ) : futureData.best_odds_matchups_future?.length ? (
                <div className="space-y-4">
                  {futureData.best_odds_matchups_future.map((game: BestOddsGame) => (
                    <GamePickCard key={game.game_id} game={game} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No picks available for the upcoming week.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Next Best Picks Section */}
      <div className="mt-10">
        <DashboardHeader
          heading="Next Best Picks"
          text="Alternate recommendations based on our next best odds analysis."
        />
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">Today's Next Best</TabsTrigger>
            <TabsTrigger value="tomorrow">Tomorrow's Next Best</TabsTrigger>
            <TabsTrigger value="future">Upcoming Week</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Next Best Picks</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {nextTodayError ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Error loading next best picks for today.
                  </div>
                ) : nextTodayLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-[125px] w-full rounded-lg" />
                    <Skeleton className="h-[125px] w-full rounded-lg" />
                  </div>
                ) : nextTodayData.next_best_odds_matchups_today?.length ? (
                  <div className="space-y-4">
                    {filterDuplicates(
                      nextTodayData.next_best_odds_matchups_today,
                      todayData?.best_odds_matchups_today || []
                    ).map((game: BestOddsGame) => (
                      <GamePickCard key={game.game_id} game={game} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No next best picks available for today.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tomorrow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tomorrow's Next Best Picks</CardTitle>
                <CardDescription>
                  {new Date(Date.now() + 86400000).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {nextTomorrowError ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Error loading next best picks for tomorrow.
                  </div>
                ) : nextTomorrowLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-[125px] w-full rounded-lg" />
                    <Skeleton className="h-[125px] w-full rounded-lg" />
                  </div>
                ) : nextTomorrowData.next_best_odds_matchups_tomorrow?.length ? (
                  <div className="space-y-4">
                    {filterDuplicates(
                      nextTomorrowData.next_best_odds_matchups_tomorrow,
                      tomorrowData?.best_odds_matchups_tomorrow || []
                    ).map((game: BestOddsGame) => (
                      <GamePickCard key={game.game_id} game={game} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No next best picks available for tomorrow.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="future" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Week's Next Best Picks</CardTitle>
                <CardDescription>Next best picks for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {nextFutureError ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Error loading next best picks for the upcoming week.
                  </div>
                ) : nextFutureLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-[125px] w-full rounded-lg" />
                    <Skeleton className="h-[125px] w-full rounded-lg" />
                    <Skeleton className="h-[125px] w-full rounded-lg" />
                  </div>
                ) : nextFutureData.next_best_odds_matchups_future?.length ? (
                  <div className="space-y-4">
                    {filterDuplicates(
                      nextFutureData.next_best_odds_matchups_future,
                      futureData?.best_odds_matchups_future || []
                    ).map((game: BestOddsGame) => (
                      <GamePickCard key={game.game_id} game={game} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No next best picks available for the upcoming week.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}

function GamePickCard({ game }: { game: BestOddsGame }) {
  const displayDate = formatCentralDate(game.game_date)
  const awayLogo = getTeamLogo(game.away_team)
  const homeLogo = getTeamLogo(game.home_team)
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="relative h-16 w-16">
                <Image
                  src={awayLogo}
                  alt={`${game.away_team} logo`}
                  fill
                  className="object-contain opacity-60"
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {game.away_team}
              </span>
            </div>

            <div className="text-lg font-bold">@</div>

            <div className="flex flex-col items-center gap-2">
              <div className="relative h-20 w-20">
                <Image
                  src={homeLogo}
                  alt={`${game.home_team} logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-medium">{game.home_team}</span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              Away Travel: {game.away_travel.toLocaleString()} km
            </Badge>

            <div className="text-sm text-muted-foreground">{displayDate}</div>

            <Button size="sm" className="mt-2">
              <span className="mr-2">Pick:</span> {game.home_team}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatCentralDate(dateString: string) {
  // Parse the date as if it's intended for Central (assume the string is "YYYY-MM-DD")
  const date = new Date(dateString + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}
