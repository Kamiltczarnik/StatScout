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
import { NflPlayerCard, NflPlayerStats } from "@/components/NflPlayerCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NflDashboardShell } from "@/components/nfl-dashboard-shell";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface NflApiPlayer {
  player_id: string;
  full_name: string;
  team: string; // This is team abbreviation from nfl_players table
  position: string;
  jersey: string; // Jersey number as string
  headshot_url?: string;
  // Stats will be nested under a stats object from the API for leaders
  stats: NflPlayerStats;
}

interface NflPlayerCategory {
  value: string;
  label: string;
  description: string;
  apiUrl: string;
  statCategory: "passing" | "rushing" | "receiving" | "defense" | "general";
}

const playerCategories: NflPlayerCategory[] = [
  {
    value: "passing-leaders",
    label: "Passing Leaders",
    description: "Top QBs by passing yards and touchdowns.",
    apiUrl: "http://localhost:8000/nfl/players/leaders/passing", // Placeholder API
    statCategory: "passing",
  },
  {
    value: "rushing-leaders",
    label: "Rushing Leaders",
    description: "Top players by rushing yards and touchdowns.",
    apiUrl: "http://localhost:8000/nfl/players/leaders/rushing", // Placeholder API
    statCategory: "rushing",
  },
  {
    value: "receiving-leaders",
    label: "Receiving Leaders",
    description: "Top players by receiving yards and touchdowns.",
    apiUrl: "http://localhost:8000/nfl/players/leaders/receiving", // Placeholder API
    statCategory: "receiving",
  },
  {
    value: "tackling-leaders",
    label: "Tackling Leaders",
    description: "Top defensive players by tackles and sacks.",
    apiUrl: "http://localhost:8000/nfl/players/leaders/defense", // Placeholder API
    statCategory: "defense",
  },
];

// Simple cache object
const categoryCache: Record<
  string,
  { data: NflApiPlayer[]; timestamp: number }
> = {};
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const PlayerList: React.FC<{ category: NflPlayerCategory }> = ({
  category,
}) => {
  const now = Date.now();
  const cachedEntry = categoryCache[category.value];
  const shouldUseCache =
    cachedEntry && now - cachedEntry.timestamp < CACHE_DURATION_MS;

  const {
    data: apiResponse,
    error,
    isValidating,
  } = useSWR(shouldUseCache ? null : category.apiUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (apiResponse?.players && !shouldUseCache) {
      categoryCache[category.value] = {
        data: apiResponse.players,
        timestamp: Date.now(),
      };
    }
  }, [apiResponse, category.value, shouldUseCache]);

  const players: NflApiPlayer[] = useMemo(() => {
    return shouldUseCache ? cachedEntry.data : apiResponse?.players || [];
  }, [shouldUseCache, cachedEntry, apiResponse?.players]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load {category.label.toLowerCase()} data. Please try again
          later.
        </AlertDescription>
      </Alert>
    );
  }

  if ((isValidating && !shouldUseCache) || (!players && !error)) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-[420px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (players.length === 0 && !isValidating) {
    return (
      <p className="text-center text-muted-foreground">
        No {category.label.toLowerCase()} found.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {players.slice(0, 12).map((player) => (
        <NflPlayerCard
          key={player.player_id}
          player_id={player.player_id}
          name={player.full_name}
          headshot_url={player.headshot_url}
          team_abbr={player.team} // API returns team abbreviation
          position={player.position}
          jersey_number={player.jersey}
          stats={player.stats} // Pass the whole stats object
          category={category.statCategory}
        />
      ))}
    </div>
  );
};

export default function NflPlayersPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render skeletons or null on the server/initial client render to avoid hydration mismatch
    // For tabs, it's often better to let them render and handle loading state internally.
  }

  return (
    <NflDashboardShell>
      <DashboardHeader
        heading="NFL Players"
        text="View all NFL players and their stats."
      />
      <Tabs defaultValue={playerCategories[0].value} className="space-y-4">
        <TabsList className="overflow-x-auto whitespace-nowrap">
          {playerCategories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {playerCategories.map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{cat.label}</CardTitle>
                <CardDescription>{cat.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {isMounted ? (
                  <PlayerList category={cat} />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                      <Skeleton
                        key={i}
                        className="h-[420px] w-full rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </NflDashboardShell>
  );
}
