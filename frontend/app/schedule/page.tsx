import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { GameSchedule } from "@/components/game-schedule"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function SchedulePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="NHL Schedule" text="View upcoming and past NHL games." />

      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
        <Card className="md:row-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view games</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" className="rounded-md border" />
            <div className="mt-4 flex justify-between">
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Game Schedule</CardTitle>
            <CardDescription>March 7, 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Games</TabsTrigger>
                <TabsTrigger value="eastern">Eastern</TabsTrigger>
                <TabsTrigger value="western">Western</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <GameSchedule />
              </TabsContent>

              <TabsContent value="eastern" className="space-y-4">
                <GameSchedule conferenceFilter="Eastern" />
              </TabsContent>

              <TabsContent value="western" className="space-y-4">
                <GameSchedule conferenceFilter="Western" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Games</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <GameSchedule upcoming={true} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

