"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GameSchedule } from "@/components/game-schedule"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { useState } from "react"
import { format, isSameDay, addDays, subDays } from "date-fns"

export default function SchedulePage() {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState<Date>(today)
  const isToday = isSameDay(selectedDate, today)

  const handlePreviousDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1))
  }

  const handleNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1))
  }

  const handleToday = () => {
    setSelectedDate(today)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="NHL Schedule" text="View upcoming and past NHL games." />

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Game Schedule</CardTitle>
                <CardDescription className="mt-1">
                  {format(selectedDate, "MMMM d, yyyy")} {isToday && "(Today)"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePreviousDay}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={handleToday}>
                  <Calendar className="mr-1 h-4 w-4" />
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextDay}>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Games</TabsTrigger>
                <TabsTrigger value="eastern">Eastern</TabsTrigger>
                <TabsTrigger value="western">Western</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <GameSchedule selectedDate={selectedDate} />
              </TabsContent>

              <TabsContent value="eastern" className="space-y-4">
                <GameSchedule conferenceFilter="Eastern" selectedDate={selectedDate} />
              </TabsContent>

              <TabsContent value="western" className="space-y-4">
                <GameSchedule conferenceFilter="Western" selectedDate={selectedDate} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Games</CardTitle>
            <CardDescription>Next 7 days (excluding today)</CardDescription>
          </CardHeader>
          <CardContent>
            <GameSchedule upcoming={true} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

