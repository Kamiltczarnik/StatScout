import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface GameScheduleProps {
  conferenceFilter?: "Eastern" | "Western"
  upcoming?: boolean
}

export function GameSchedule({ conferenceFilter, upcoming = false }: GameScheduleProps) {
  const games = [
    {
      date: "Mar 7, 2025",
      time: "7:00 PM",
      homeTeam: "Boston Bruins",
      homeConference: "Eastern",
      awayTeam: "Toronto Maple Leafs",
      awayConference: "Eastern",
      venue: "TD Garden",
      broadcast: "ESPN+",
    },
    {
      date: "Mar 7, 2025",
      time: "7:30 PM",
      homeTeam: "New York Rangers",
      homeConference: "Eastern",
      awayTeam: "Washington Capitals",
      awayConference: "Eastern",
      venue: "Madison Square Garden",
      broadcast: "TNT",
    },
    {
      date: "Mar 7, 2025",
      time: "9:00 PM",
      homeTeam: "Colorado Avalanche",
      homeConference: "Western",
      awayTeam: "Dallas Stars",
      awayConference: "Western",
      venue: "Ball Arena",
      broadcast: "ESPN",
    },
    {
      date: "Mar 7, 2025",
      time: "10:00 PM",
      homeTeam: "Vegas Golden Knights",
      homeConference: "Western",
      awayTeam: "Los Angeles Kings",
      awayConference: "Western",
      venue: "T-Mobile Arena",
      broadcast: "NHL Network",
    },
    {
      date: "Mar 8, 2025",
      time: "1:00 PM",
      homeTeam: "Philadelphia Flyers",
      homeConference: "Eastern",
      awayTeam: "Pittsburgh Penguins",
      awayConference: "Eastern",
      venue: "Wells Fargo Center",
      broadcast: "ESPN+",
    },
    {
      date: "Mar 8, 2025",
      time: "7:00 PM",
      homeTeam: "Edmonton Oilers",
      homeConference: "Western",
      awayTeam: "Calgary Flames",
      awayConference: "Western",
      venue: "Rogers Place",
      broadcast: "CBC",
    },
  ]

  const filteredGames = conferenceFilter
    ? games.filter((game) => game.homeConference === conferenceFilter || game.awayConference === conferenceFilter)
    : games

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
          {filteredGames.map((game, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="font-medium">{game.date}</div>
                <div className="text-sm text-muted-foreground">{game.time}</div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>
                    {game.awayTeam} @ {game.homeTeam}
                  </span>
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

