import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function RecentGames() {
  const games = [
    {
      date: "Mar 6, 2025",
      homeTeam: "Boston Bruins",
      homeScore: 4,
      awayTeam: "Toronto Maple Leafs",
      awayScore: 2,
      status: "Final",
    },
    {
      date: "Mar 6, 2025",
      homeTeam: "New York Rangers",
      homeScore: 3,
      awayTeam: "Washington Capitals",
      awayScore: 2,
      status: "Final OT",
    },
    {
      date: "Mar 5, 2025",
      homeTeam: "Tampa Bay Lightning",
      homeScore: 5,
      awayTeam: "Florida Panthers",
      awayScore: 3,
      status: "Final",
    },
    {
      date: "Mar 5, 2025",
      homeTeam: "Edmonton Oilers",
      homeScore: 2,
      awayTeam: "Calgary Flames",
      awayScore: 1,
      status: "Final SO",
    },
    {
      date: "Mar 4, 2025",
      homeTeam: "Vegas Golden Knights",
      homeScore: 4,
      awayTeam: "Los Angeles Kings",
      awayScore: 0,
      status: "Final",
    },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Matchup</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{game.date}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className={game.homeScore > game.awayScore ? "font-bold" : ""}>
                    {game.homeTeam} {game.homeScore}
                  </span>
                  <span className={game.awayScore > game.homeScore ? "font-bold" : ""}>
                    {game.awayTeam} {game.awayScore}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant={game.status.includes("OT") || game.status.includes("SO") ? "outline" : "secondary"}>
                  {game.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

