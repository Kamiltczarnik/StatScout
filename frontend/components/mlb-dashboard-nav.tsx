import Link from "next/link"
import { HopIcon as Hockey, BarChart3, Calendar, Trophy, Users, Home, TrendingUp } from "lucide-react"

export function DashboardNav() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Hockey className="h-6 w-6" />
            <span>StatScout</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-all"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/mlb/teams"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-all"
            >
              <Trophy className="h-4 w-4" />
              Teams
            </Link>
            <Link
              href="/mlb/players"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-all"
            >
              <Users className="h-4 w-4" />
              Players
            </Link>
            <Link
              href="/mlb/schedule"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-all"
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </Link>
            <Link
              href="/mlb/scout-picks"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-all"
            >
              <TrendingUp className="h-4 w-4" />
              Scout Picks
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
        </div>
      </div>
    </div>
  )
}

