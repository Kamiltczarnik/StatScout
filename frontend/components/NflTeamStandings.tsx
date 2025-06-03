import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NflStandingTeamData {
  team_id: string;
  name: string;
  abbreviation: string;
  conference: string;
  division: string; // Full division name like "AFC East"
  total_wins: number;
  total_losses: number;
  total_ties: number;
  total_points_for: number;
  total_points_against: number;
  // Add other relevant stats like win_percentage, games_played if available and needed
}

interface NflTeamStandingsProps {
  standings: NflStandingTeamData[];
  divisionFilter?: string; // e.g., "AFC East", "NFC North"
}

export function NflTeamStandings({
  standings,
  divisionFilter,
}: NflTeamStandingsProps) {
  const filteredStandings = divisionFilter
    ? standings.filter((team) => team.division === divisionFilter) // Assuming team.division is full name like "AFC East"
    : standings;

  // Sort by wins, then fewest losses, then fewest ties
  const sortedStandings = [...filteredStandings].sort((a, b) => {
    if (b.total_wins !== a.total_wins) {
      return b.total_wins - a.total_wins;
    }
    if (a.total_losses !== b.total_losses) {
      return a.total_losses - b.total_losses;
    }
    return a.total_ties - b.total_ties; // Fewer ties is better if wins and losses are same (though rare in NFL)
  });

  if (!sortedStandings || sortedStandings.length === 0) {
    return <p>No standings data available.</p>;
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Team</TableHead>
            <TableHead className="text-center whitespace-nowrap">W</TableHead>
            <TableHead className="text-center whitespace-nowrap">L</TableHead>
            <TableHead className="text-center whitespace-nowrap">T</TableHead>
            <TableHead className="text-center whitespace-nowrap">PF</TableHead>
            <TableHead className="text-center whitespace-nowrap">PA</TableHead>
            <TableHead className="text-center whitespace-nowrap">
              Diff
            </TableHead>
            {/* Add other columns as needed, e.g., PCT, Home, Away */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStandings.map((team) => (
            <TableRow key={team.team_id}>
              <TableCell className="font-medium whitespace-nowrap">
                {team.name} ({team.abbreviation})
              </TableCell>
              <TableCell className="text-center">{team.total_wins}</TableCell>
              <TableCell className="text-center">{team.total_losses}</TableCell>
              <TableCell className="text-center">{team.total_ties}</TableCell>
              <TableCell className="text-center">
                {team.total_points_for}
              </TableCell>
              <TableCell className="text-center">
                {team.total_points_against}
              </TableCell>
              <TableCell className="text-center">
                {team.total_points_for - team.total_points_against}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
