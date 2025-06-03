"use client"

import useSWR from "swr"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

// Simple fetcher for SWR.
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function PlayerStats() {
  const { data, error, isValidating } = useSWR(
    "http://localhost:8000/players/stats",
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  )

  if (error) {
    return (
      <p className="text-red-500 text-center">
        Error loading player stats.
      </p>
    )
  }

  if (isValidating || !data) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/2 rounded" />
        <Skeleton className="h-6 w-full rounded" />
        <Skeleton className="h-6 w-full rounded" />
        <Skeleton className="h-6 w-full rounded" />
      </div>
    )
  }

  // Use optional chaining and default to an empty array.
  const players = data?.players ?? []

  if (players.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No player stats available.
      </p>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">GP</TableHead>
            <TableHead className="text-center">G</TableHead>
            <TableHead className="text-center">A</TableHead>
            <TableHead className="text-center">PTS</TableHead>
            <TableHead className="text-center">+/-</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player: any, index: number) => (
            <TableRow key={player.name || index}>
              <TableCell className="font-medium">{player.name}</TableCell>
              <TableCell>{player.team}</TableCell>
              <TableCell className="text-center">{player.gp}</TableCell>
              <TableCell className="text-center">{player.g}</TableCell>
              <TableCell className="text-center">{player.a}</TableCell>
              <TableCell className="text-center font-bold">{player.pts}</TableCell>
              <TableCell className="text-center">{player.plusMinus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
