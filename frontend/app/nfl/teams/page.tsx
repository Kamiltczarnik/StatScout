"use client";

import useSWR from "swr";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { NflTeamCard } from "@/components/NflTeamCard"; // Changed to NflTeamCard
import { NflTeamStandings } from "@/components/NflTeamStandings"; // Changed to NflTeamStandings
import { nflTeamLogos } from "@/app/nfl/nfl_team_logos";
import { NflDashboardShell } from "@/components/nfl-dashboard-shell";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// NFL Divisions and Conferences
const nflConferences = {
  AFC: "AFC",
  NFC: "NFC",
};

const nflDivisionsShort = {
  EAST: "East",
  NORTH: "North",
  SOUTH: "South",
  WEST: "West",
};

const nflDivisions = {
  afc: [
    {
      name: "AFC East",
      value: "afc-east",
      conference: nflConferences.AFC,
      divisionShort: nflDivisionsShort.EAST,
    },
    {
      name: "AFC North",
      value: "afc-north",
      conference: nflConferences.AFC,
      divisionShort: nflDivisionsShort.NORTH,
    },
    {
      name: "AFC South",
      value: "afc-south",
      conference: nflConferences.AFC,
      divisionShort: nflDivisionsShort.SOUTH,
    },
    {
      name: "AFC West",
      value: "afc-west",
      conference: nflConferences.AFC,
      divisionShort: nflDivisionsShort.WEST,
    },
  ],
  nfc: [
    {
      name: "NFC East",
      value: "nfc-east",
      conference: nflConferences.NFC,
      divisionShort: nflDivisionsShort.EAST,
    },
    {
      name: "NFC North",
      value: "nfc-north",
      conference: nflConferences.NFC,
      divisionShort: nflDivisionsShort.NORTH,
    },
    {
      name: "NFC South",
      value: "nfc-south",
      conference: nflConferences.NFC,
      divisionShort: nflDivisionsShort.SOUTH,
    },
    {
      name: "NFC West",
      value: "nfc-west",
      conference: nflConferences.NFC,
      divisionShort: nflDivisionsShort.WEST,
    },
  ],
};

interface ApiNflTeam {
  team_id: string;
  name: string;
  abbreviation: string;
  city: string;
  conference: string; // e.g., "AFC", "NFC"
  division: string; // e.g., "East", "North"
  // Logo might be derived or constructed, not directly from this API structure typically
  wins?: number;
  losses?: number;
  ties?: number;
}

interface ApiNflStandingTeam {
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
}

export default function NflTeamsPage() {
  const { data: teamsApiResponse, error: teamsError } = useSWR(
    "http://localhost:8000/nfl/teams",
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const { data: standingsApiResponse, error: standingsError } = useSWR(
    "http://localhost:8000/nfl/standings",
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const teams: ApiNflTeam[] = teamsApiResponse?.teams;
  const standings: ApiNflStandingTeam[] = standingsApiResponse?.standings;

  const loading = !teams || !standings;
  const error = teamsError || standingsError;

  // Create a map for quick lookup of standings by team_id
  const standingsMap = new Map<string, ApiNflStandingTeam>();
  if (standings) {
    standings.forEach((s) => standingsMap.set(s.team_id, s));
  }

  return (
    <NflDashboardShell>
      <DashboardHeader
        heading="NFL Teams"
        text="View all NFL teams, standings, and statistics."
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error Loading NFL Data</AlertTitle>
          <AlertDescription>
            {error.message || "An unexpected error occurred."}
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="space-y-6 p-4 md:p-6">
          <Skeleton className="h-10 w-full max-w-md rounded-md" />{" "}
          {/* TabsList skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-[220px] w-full rounded-lg"
              /> /* TeamCard skeleton */
            ))}
          </div>
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Teams</TabsTrigger>
            {nflDivisions.afc.map((div) => (
              <TabsTrigger key={div.value} value={div.value}>
                {div.name}
              </TabsTrigger>
            ))}
            {nflDivisions.nfc.map((div) => (
              <TabsTrigger key={div.value} value={div.value}>
                {div.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All Teams Tab */}
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {teams?.map((team: ApiNflTeam) => (
                <NflTeamCard
                  key={team.team_id}
                  name={team.name}
                  logo={
                    nflTeamLogos[team.abbreviation] ||
                    "/assets/logos/nfl/placeholder.png"
                  }
                  conference={team.conference}
                  division={team.division}
                  record={
                    team.wins !== undefined &&
                    team.losses !== undefined &&
                    team.ties !== undefined
                      ? {
                          wins: team.wins,
                          losses: team.losses,
                          ties: team.ties,
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          </TabsContent>

          {/* Dynamic Division Tabs */}
          {[...nflDivisions.afc, ...nflDivisions.nfc].map((divisionGroup) => (
            <TabsContent
              key={divisionGroup.value}
              value={divisionGroup.value}
              className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{divisionGroup.name}</CardTitle>
                  <CardDescription>
                    Teams in the {divisionGroup.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {teams
                      ?.filter(
                        (team: ApiNflTeam) =>
                          team.conference?.toUpperCase() ===
                            divisionGroup.conference?.toUpperCase() &&
                          team.division?.toUpperCase() ===
                            divisionGroup.divisionShort?.toUpperCase()
                      )
                      .map((team: ApiNflTeam) => (
                        <NflTeamCard
                          key={team.team_id}
                          name={team.name}
                          logo={
                            nflTeamLogos[team.abbreviation] ||
                            "/assets/logos/nfl/placeholder.png"
                          }
                          conference={team.conference}
                          division={team.division}
                          record={
                            team.wins !== undefined &&
                            team.losses !== undefined &&
                            team.ties !== undefined
                              ? {
                                  wins: team.wins,
                                  losses: team.losses,
                                  ties: team.ties,
                                }
                              : undefined
                          }
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{divisionGroup.name} Standings</CardTitle>
                </CardHeader>
                <CardContent>
                  <NflTeamStandings
                    standings={
                      standings?.filter(
                        (s) => s.division === divisionGroup.name
                      ) || []
                    }
                    // divisionFilter={divisionGroup.name} // NflTeamStandings now filters internally if standings prop is pre-filtered
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </NflDashboardShell>
  );
}
