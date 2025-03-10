import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TeamStandings() {
  const divisions = [
    {
      name: "Atlantic",
      teams: [
        { name: "Boston Bruins", gp: 82, w: 47, l: 18, otl: 17, pts: 111, gf: 275, ga: 221 },
        { name: "Toronto Maple Leafs", gp: 82, w: 46, l: 26, otl: 10, pts: 102, gf: 277, ga: 236 },
        { name: "Tampa Bay Lightning", gp: 82, w: 45, l: 29, otl: 8, pts: 98, gf: 280, ga: 243 },
        { name: "Florida Panthers", gp: 82, w: 42, l: 32, otl: 8, pts: 92, gf: 272, ga: 265 },
      ],
    },
    {
      name: "Metropolitan",
      teams: [
        { name: "Carolina Hurricanes", gp: 82, w: 52, l: 21, otl: 9, pts: 113, gf: 262, ga: 210 },
        { name: "New York Rangers", gp: 82, w: 52, l: 25, otl: 5, pts: 109, gf: 246, ga: 204 },
        { name: "New Jersey Devils", gp: 82, w: 37, l: 38, otl: 7, pts: 81, gf: 248, ga: 275 },
        { name: "New York Islanders", gp: 82, w: 35, l: 37, otl: 10, pts: 80, gf: 225, ga: 240 },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      {divisions.map((division) => (
        <div key={division.name} className="space-y-2">
          <h3 className="font-semibold">{division.name} Division</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">GP</TableHead>
                  <TableHead className="text-center">W</TableHead>
                  <TableHead className="text-center">L</TableHead>
                  <TableHead className="text-center">OTL</TableHead>
                  <TableHead className="text-center">PTS</TableHead>
                  <TableHead className="text-center">GF</TableHead>
                  <TableHead className="text-center">GA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {division.teams.map((team) => (
                  <TableRow key={team.name}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell className="text-center">{team.gp}</TableCell>
                    <TableCell className="text-center">{team.w}</TableCell>
                    <TableCell className="text-center">{team.l}</TableCell>
                    <TableCell className="text-center">{team.otl}</TableCell>
                    <TableCell className="text-center font-bold">{team.pts}</TableCell>
                    <TableCell className="text-center">{team.gf}</TableCell>
                    <TableCell className="text-center">{team.ga}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  )
}

