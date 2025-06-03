import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface NflPlayerStats {
  games_played?: number;
  // Passing
  passing_attempts?: number;
  completions?: number;
  passing_yards?: number;
  passing_tds?: number;
  interceptions?: number;
  sacks_taken?: number; // Sacks on the QB
  // Rushing
  carries?: number;
  rushing_yards?: number;
  rushing_tds?: number;
  // Receiving
  targets?: number;
  receptions?: number;
  receiving_yards?: number;
  receiving_tds?: number;
  // Defense
  tackles?: number;
  sacks_defense?: number; // Sacks by the player
  tackles_for_loss?: number;
  passes_defended?: number;
  fumbles_forced?: number;
  fumbles_recovered?: number;
  // Add more stats as needed, e.g., QB rating, yards per carry/reception
}

interface NflPlayerCardProps {
  player_id: string;
  name: string;
  headshot_url?: string;
  team_abbr: string; // e.g., "DAL"
  position: string; // e.g., "QB", "WR"
  jersey_number?: string;
  stats?: NflPlayerStats;
  // Category to determine which stats to primarily display
  category: "passing" | "rushing" | "receiving" | "defense" | "general";
}

const StatDisplay: React.FC<{
  label: string;
  value: string | number | undefined;
}> = ({ label, value }) => (
  <div className="text-center">
    <div className="font-semibold text-base md:text-lg">{value ?? "-"}</div>
    <div className="text-xs text-muted-foreground uppercase tracking-wider">
      {label}
    </div>
  </div>
);

export function NflPlayerCard({
  player_id,
  name,
  headshot_url,
  team_abbr,
  position,
  jersey_number,
  stats = {},
  category,
}: NflPlayerCardProps) {
  const renderStats = () => {
    switch (category) {
      case "passing":
        return (
          <>
            <StatDisplay label="YDS" value={stats.passing_yards} />
            <StatDisplay label="TD" value={stats.passing_tds} />
            <StatDisplay label="INT" value={stats.interceptions} />
            <StatDisplay label="CMP" value={stats.completions} />
          </>
        );
      case "rushing":
        return (
          <>
            <StatDisplay label="YDS" value={stats.rushing_yards} />
            <StatDisplay label="TD" value={stats.rushing_tds} />
            <StatDisplay label="CAR" value={stats.carries} />
            <StatDisplay label="GP" value={stats.games_played} />
          </>
        );
      case "receiving":
        return (
          <>
            <StatDisplay label="YDS" value={stats.receiving_yards} />
            <StatDisplay label="TD" value={stats.receiving_tds} />
            <StatDisplay label="REC" value={stats.receptions} />
            <StatDisplay label="TGT" value={stats.targets} />
          </>
        );
      case "defense":
        return (
          <>
            <StatDisplay label="TKL" value={stats.tackles} />
            <StatDisplay label="SACK" value={stats.sacks_defense} />
            <StatDisplay label="TFL" value={stats.tackles_for_loss} />
            <StatDisplay label="PD" value={stats.passes_defended} />
          </>
        );
      default: // general or fallback
        return (
          <>
            <StatDisplay label="GP" value={stats.games_played} />
            <StatDisplay label="POS" value={position} />
            {/* Add a generic stat or leave empty */}
          </>
        );
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full w-full max-w-sm mx-auto group">
      <CardHeader className="p-0 relative bg-muted/30 dark:bg-muted/20">
        <div className="aspect-[4/3] w-full flex justify-center items-center overflow-hidden">
          <Image
            src={headshot_url || "/assets/logos/nfl/player_placeholder.png"} // Placeholder if no image
            alt={`${name} headshot`}
            width={200} // Adjust as needed
            height={150} // Adjust as needed
            className="object-cover object-top w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-3 w-full">
          <h3 className="text-xl font-bold text-white truncate" title={name}>
            {name}
          </h3>
          <p className="text-sm text-gray-200">
            {team_abbr && `${team_abbr} `}
            {jersey_number && `#${jersey_number} `}
            {position && `• ${position}`}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <div className="grid grid-cols-4 gap-2 text-sm mt-2">
          {renderStats()}
        </div>
      </CardContent>

      <CardFooter className="p-3 border-t">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full text-primary hover:bg-primary/10">
          <Link href={`/nfl/player/${player_id}`}>View Full Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
