"use client";

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
import { NflGameSchedule } from "@/components/NflGameSchedule";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useState } from "react";
import { format, isSameDay, addDays, subDays } from "date-fns";

export default function NflSchedulePage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const isToday = isSameDay(selectedDate, today);

  const handlePreviousDay = () => {
    setSelectedDate((prevDate) => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => addDays(prevDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(today);
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="NFL Schedule"
        text="View upcoming and past NFL games for the 2024-2025 season (current) and 2025-2026 season (upcoming)."
      />

      <div className="grid gap-6">
        {/* Daily Schedule Card */}
        <Card>
          <CardHeader className="pb-4 border-b">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Daily Game Schedule</CardTitle>
                <CardDescription className="mt-1">
                  {format(selectedDate, "MMMM d, yyyy")}
                  {isToday && " (Today)"} - 2024-2025 Season
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousDay}
                  aria-label="Previous day">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToday}
                  className="px-3">
                  <CalendarIcon className="mr-1.5 h-4 w-4" />
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextDay}
                  aria-label="Next day">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Games</TabsTrigger>
                <TabsTrigger value="AFC">AFC</TabsTrigger>
                <TabsTrigger value="NFC">NFC</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <NflGameSchedule selectedDate={selectedDate} />
              </TabsContent>
              <TabsContent value="AFC">
                <NflGameSchedule
                  selectedDate={selectedDate}
                  conferenceFilter="AFC"
                />
              </TabsContent>
              <TabsContent value="NFC">
                <NflGameSchedule
                  selectedDate={selectedDate}
                  conferenceFilter="NFC"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Upcoming Games Card (Next 7 Days - 2025-2026 Season) */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Games (Next 7 Days)</CardTitle>
            <CardDescription>
              Showing games for the 2025-2026 NFL season.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NflGameSchedule upcoming={true} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
