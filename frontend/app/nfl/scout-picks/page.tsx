"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { NflDashboardShell } from "@/components/nfl-dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function NflScoutPicksPage() {
  return (
    <NflDashboardShell>
      <DashboardHeader
        heading="NFL Scout Picks"
        text="Data-driven game predictions for NFL."
      />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Page Under Construction
            </CardTitle>
            <CardDescription>
              This NFL Scout Picks page is currently under development. Check
              back soon for exciting new features!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We are working hard to bring you advanced analytics and
              data-driven picks for NFL games. Stay tuned!
            </p>
          </CardContent>
        </Card>
      </div>
    </NflDashboardShell>
  );
}
