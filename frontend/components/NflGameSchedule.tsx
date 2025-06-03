"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns"; // Added parseISO
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NflGame {
  game_id: string;
  season: string;
  game_date: string; // YYYY-MM-DD from backend
  status: string; // e.g., "Scheduled", "In Progress", "Final"
  week: string;
  home_team_id: string;
  home_team_name: string;
  home_team_abbr: string;
  home_team_score?: number;
  away_team_id: string;
  away_team_name: string;
  away_team_abbr: string;
  away_team_score?: number;
  // Add venue, broadcast, time if these come from the /nfl/schedule endpoint
  // Based on NHL version, we expect: venue, broadcast, time (already part of game_date effectively)
  // The current nfl_crud.get_nfl_schedule returns the NflGame model which has these directly.
  // For display, we might need to format time separately.
  // Let's assume the API will provide a suitable time string or we derive it.
  time?: string; // e.g. "01:00 PM ET" - needs to be provided by API or formatted from game_date + a timezone
  venue?: string; // Needs to be added to NflGame schema/crud if not present
  broadcast?: string; // Needs to be added to NflGame schema/crud if not present
}

interface NflGameScheduleProps {
  conferenceFilter?: "AFC" | "NFC";
  upcoming?: boolean;
  selectedDate?: Date;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function NflGameSchedule({
  conferenceFilter,
  upcoming = false,
  selectedDate,
}: NflGameScheduleProps) {
  let queryParams = "";
  let apiUrl = "http://localhost:8000/nfl/schedule";

  if (upcoming) {
    // For the future schedule, use the first week of the 2025 season (not next 7 days)
    queryParams = "?upcoming=true&season=2025";
  } else if (selectedDate) {
    // Use the 2024 season for current schedule
    queryParams = `?date=${format(selectedDate, "yyyy-MM-dd")}&season=2024`;
  } else {
    // Default to today for 2024 season if no specific date or upcoming flag
    queryParams = `?season=2024`;
  }

  const url = `${apiUrl}${queryParams}`;

  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: upcoming ? 60000 : 30000, // Refresh less often for upcoming static list
  });

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading NFL Schedule</AlertTitle>
        <AlertDescription>
          {error.message || "Could not load game data. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading || !apiResponse) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Date & Time</TableHead>
              <TableHead>Matchup</TableHead>
              <TableHead className="hidden md:table-cell">Venue</TableHead>
              <TableHead className="text-right hidden sm:table-cell">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40 md:w-48" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-20 md:w-32" />
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  <Skeleton className="h-4 w-16 md:w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  const games: NflGame[] = apiResponse.games || [];

  const filteredGames = games.filter((game) => {
    if (!conferenceFilter) return true;
    // Need to know how conference is associated with a game.
    // Assuming nfl_games table has home_team_conference and away_team_conference,
    // or we infer from team_id via nfl_teams table join in backend.
    // For now, let's assume the API response for a game includes this, or we adjust.
    // The current nfl_crud.get_nfl_schedule directly returns NflGame model,
    // which doesn't have conference info per game. This needs to be added to backend.
    // Placeholder: assume game object has `homeTeamConference` and `awayTeamConference`
    // return game.homeTeamConference === conferenceFilter || game.awayTeamConference === conferenceFilter;
    // For now, since backend doesn't provide this per game directly, we can't filter by conf here
    // This filtering should ideally happen in the backend if possible, or by enhancing game data.
    return true; // No conference filter client-side until backend provides data
  });

  if (filteredGames.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No NFL games scheduled for this period or filter.
      </div>
    );
  }

  // Sort games by date and then by time (assuming game_date contains full ISO string or similar)
  // The `game_date` from DB is just YYYY-MM-DD. We need a time field.
  // Let's assume an API field `game_datetime_utc` for sorting and `display_time` for showing.
  const sortedGames = [...filteredGames].sort((a, b) => {
    const dateA = new Date(a.game_date + (a.time ? `T${a.time}` : "T00:00:00")); // Combine date and time
    const dateB = new Date(b.game_date + (b.time ? `T${b.time}` : "T00:00:00"));
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px] whitespace-nowrap">
              Date & Time
            </TableHead>
            <TableHead className="whitespace-nowrap">Matchup</TableHead>
            <TableHead className="hidden md:table-cell whitespace-nowrap">
              Venue
            </TableHead>
            <TableHead className="text-right hidden sm:table-cell whitespace-nowrap">
              Status
            </TableHead>
            {/* Add Broadcast if available from API */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedGames.map((game) => (
            <TableRow key={game.game_id}>
              <TableCell>
                <div className="font-medium">
                  {format(parseISO(game.game_date), "EEE, MMM d")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {game.time || "TBD"}{" "}
                  {/* Assuming API provides formatted time */}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {game.away_team_name} ({game.away_team_abbr}) @{" "}
                  {game.home_team_name} ({game.home_team_abbr})
                </div>
                {game.home_team_score !== null &&
                  game.away_team_score !== null &&
                  game.status !== "Scheduled" && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Score: {game.away_team_score} - {game.home_team_score}
                    </div>
                  )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {game.venue || "TBD"}
              </TableCell>
              <TableCell className="text-right hidden sm:table-cell">
                <Badge
                  variant={
                    game.status === "Final"
                      ? "secondary"
                      : game.status === "In Progress"
                      ? "destructive"
                      : "outline"
                  }>
                  {game.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
