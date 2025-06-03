import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface PlayerCardProps {
  name: string
  image?: string
  team: string
  position: string
  number?: string
  stats: {
    gp?: number
    g?: number
    a?: number
    pts?: number
    ppg?: number  // Points per game
    gwg?: number  // Game-winning goals
    w?: number
    l?: number
    otl?: number  // Overtime losses
    sv?: number
    gaa?: number  // Goals against average
    so?: number   // Shutouts
  }
  isGoalie?: boolean
  showExtraStats?: boolean // Whether to show additional stats like PPG or GWG
}

export function PlayerCard({
  name,
  image = "/placeholder.svg",
  team,
  position,
  number = "",
  stats,
  isGoalie = false,
  showExtraStats = false,
}: PlayerCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 bg-primary/5">
        <div className="flex justify-center">
          <Image
            src={image || "/placeholder.svg"}
            alt={name || "Player image"}
            width={150}
            height={150}
            className="h-32 w-32 object-cover rounded-full"
          />
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-center mb-1">{name}</h3>
        <p className="text-sm text-center text-muted-foreground mb-3">
          {team} | #{number} | {position}
        </p>
        <div className="grid grid-cols-4 gap-2 text-sm">
          {isGoalie ? (
            // Goalie stats
            <>
              <div className="text-center">
                <div className="font-medium">{stats.gp ?? 0}</div>
                <div className="text-xs text-muted-foreground">GP</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{stats.w ?? 0}</div>
                <div className="text-xs text-muted-foreground">W</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{stats.l ?? 0}</div>
                <div className="text-xs text-muted-foreground">L</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{stats.sv ?? 0}</div>
                <div className="text-xs text-muted-foreground">SV%</div>
              </div>
              {showExtraStats && (
                <>
                  <div className="text-center">
                    <div className="font-medium">{stats.otl ?? 0}</div>
                    <div className="text-xs text-muted-foreground">OTL</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{stats.gaa ?? 0}</div>
                    <div className="text-xs text-muted-foreground">GAA</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{stats.so ?? 0}</div>
                    <div className="text-xs text-muted-foreground">SO</div>
                  </div>
                </>
              )}
            </>
          ) : (
            // Skater stats
            <>
              <div className="text-center">
                <div className="font-medium">{stats.gp ?? 0}</div>
                <div className="text-xs text-muted-foreground">GP</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{stats.g ?? 0}</div>
                <div className="text-xs text-muted-foreground">G</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{stats.a ?? 0}</div>
                <div className="text-xs text-muted-foreground">A</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{stats.pts ?? 0}</div>
                <div className="text-xs text-muted-foreground">PTS</div>
              </div>
              {showExtraStats && stats.ppg !== undefined && (
                <div className="text-center">
                  <div className="font-medium">{stats.ppg}</div>
                  <div className="text-xs text-muted-foreground">PPG</div>
                </div>
              )}
              {showExtraStats && stats.gwg !== undefined && (
                <div className="text-center">
                  <div className="font-medium">{stats.gwg}</div>
                  <div className="text-xs text-muted-foreground">GWG</div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
        <Link href={`/players/${(name || "unknown").toLowerCase().replace(/\s+/g, "-")}`}>
            View Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
