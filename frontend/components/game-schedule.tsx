"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

interface GameScheduleProps {
  conferenceFilter?: "Eastern" | "Western"
  upcoming?: boolean
  selectedDate?: Date
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function GameSchedule({ conferenceFilter, upcoming = false, selectedDate }: GameScheduleProps) {
  // Create the query parameters based on the props
  let queryParams = "";
  
  if (upcoming) {
    queryParams = "?upcoming=true";
  } else if (selectedDate) {
    queryParams = `?date=${format(selectedDate, "yyyy-MM-dd")}`;
  }
  
  const url = `http://localhost:8000/nhl/schedule${queryParams}`;

  const { data, error, isLoading } = useSWR(
    url,
    fetcher,
    { 
      revalidateOnFocus: false, 
      revalidateOnReconnect: false,
      refreshInterval: 30000 // Refresh every 30 seconds
    }
  )

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading schedule data. Please try again later.
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Matchup</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead className="text-right">Broadcast</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16 mt-2" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const games = data.games || []
  const filteredGames = conferenceFilter
    ? games.filter((game: any) => game.homeConference === conferenceFilter || game.awayConference === conferenceFilter)
    : games

  if (filteredGames.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No games scheduled for this period.
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Matchup</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead className="text-right">Broadcast</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGames.map((game: any, index: number) => (
            <TableRow key={index}>
              <TableCell>
                <div className="font-medium">{game.date}</div>
                <div className="text-sm text-muted-foreground">
                  {game.time}
                  {game.homeOdds && (
                    <div className="text-xs text-green-600 font-semibold mt-1">
                      Home odds: {game.homeOdds}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>
                    {game.awayTeam} @ {game.homeTeam}
                  </span>
                  {game.status === "In Progress" && (
                    <Badge 
                      variant="default"
                      className="mt-1 w-fit"
                    >
                      {game.status}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{game.venue}</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline">{game.broadcast}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

