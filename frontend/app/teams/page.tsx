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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { TeamCard } from "@/components/team-card"
import { TeamStandings } from "@/components/team-standings"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function TeamsPage() {
  // Fetch teams from the updated endpoint that includes records
  const { data: teamsData, error: teamsError } = useSWR("http://localhost:8000/teams", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  // Continue to fetch standings data (if you still need to display standings)
  const { data: standingsData, error: standingsError } = useSWR(
    "http://localhost:8000/team-standings",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const loading = !teamsData || !standingsData
  const error = teamsError || standingsError

  return (
    <DashboardShell>
      <DashboardHeader
        heading="NHL Teams"
        text="View all NHL teams, standings, and statistics."
      />

      {error && (
        <Alert className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading team data.
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="space-y-4 p-6">
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Teams</TabsTrigger>
            <TabsTrigger value="atlantic">Atlantic</TabsTrigger>
            <TabsTrigger value="metropolitan">Metropolitan</TabsTrigger>
            <TabsTrigger value="central">Central</TabsTrigger>
            <TabsTrigger value="pacific">Pacific</TabsTrigger>
          </TabsList>

          {/* All Teams */}
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {teamsData.teams.map((team: any) => (
                <TeamCard
  key={team.id || team.franchise_id || team.name}
  name={team.name}
  logo={team.logo}
  conference={team.conference.name || team.conference}
  division={team.division.name || team.division}
  record={team.record}
  points={team.record ? team.record.points : null}
/>

              ))}
            </div>
          </TabsContent>

          {/* Atlantic Division */}
          <TabsContent value="atlantic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Atlantic Division</CardTitle>
                <CardDescription>
                  Teams in the Atlantic Division of the Eastern Conference
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {teamsData.teams
                    .filter((team: any) => (team.division.name || team.division) === "Atlantic")
                    .map((team: any) => (
<TeamCard
  key={team.id || team.franchise_id || team.name}
  name={team.name}
  logo={team.logo}
  conference={team.conference.name || team.conference}
  division={team.division.name || team.division}
  record={team.record}
  points={team.record ? team.record.points : null}
/>

                    ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Atlantic Division Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <TeamStandings divisionFilter="Atlantic" data={standingsData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metropolitan Division */}
          <TabsContent value="metropolitan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Metropolitan Division</CardTitle>
                <CardDescription>
                  Teams in the Metropolitan Division of the Eastern Conference
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {teamsData.teams
                    .filter((team: any) => (team.division.name || team.division) === "Metropolitan")
                    .map((team: any) => (
<TeamCard
  key={team.id || team.franchise_id || team.name}
  name={team.name}
  logo={team.logo}
  conference={team.conference.name || team.conference}
  division={team.division.name || team.division}
  record={team.record}
  points={team.record ? team.record.points : null}
/>

                    ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Metropolitan Division Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <TeamStandings divisionFilter="Metropolitan" data={standingsData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Central Division */}
          <TabsContent value="central" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Central Division</CardTitle>
                <CardDescription>
                  Teams in the Central Division of the Western Conference
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {teamsData.teams
                    .filter((team: any) => (team.division.name || team.division) === "Central")
                    .map((team: any) => (
<TeamCard
  key={team.id || team.franchise_id || team.name}
  name={team.name}
  logo={team.logo}
  conference={team.conference.name || team.conference}
  division={team.division.name || team.division}
  record={team.record}
  points={team.record ? team.record.points : null}
/>

                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pacific Division */}
          <TabsContent value="pacific" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pacific Division</CardTitle>
                <CardDescription>
                  Teams in the Pacific Division of the Western Conference
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {teamsData.teams
                    .filter((team: any) => (team.division.name || team.division) === "Pacific")
                    .map((team: any) => (
<TeamCard
  key={team.id || team.franchise_id || team.name}
  name={team.name}
  logo={team.logo}
  conference={team.conference.name || team.conference}
  division={team.division.name || team.division}
  record={team.record}
  points={team.record ? team.record.points : null}
/>

                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </DashboardShell>
  )
}
