"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HopIcon as Hockey, BarChart3, Calendar, Trophy, Users, Home, TrendingUp } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

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
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/") && !isActive("/nhl") 
                  ? "bg-muted text-primary font-bold" 
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <Home className={`h-4 w-4 ${isActive("/") && !isActive("/nhl") ? "text-primary" : ""}`} />
              Home
            </Link>
            <Link
              href="/nhl/teams"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/nhl/teams") 
                  ? "bg-muted text-primary font-bold" 
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <Trophy className={`h-4 w-4 ${isActive("/nhl/teams") ? "text-primary" : ""}`} />
              Teams
            </Link>
            <Link
              href="/nhl/players"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/nhl/players") 
                  ? "bg-muted text-primary font-bold" 
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <Users className={`h-4 w-4 ${isActive("/nhl/players") ? "text-primary" : ""}`} />
              Players
            </Link>
            <Link
              href="/nhl/schedule"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/nhl/schedule") 
                  ? "bg-muted text-primary font-bold" 
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <Calendar className={`h-4 w-4 ${isActive("/nhl/schedule") ? "text-primary" : ""}`} />
              Schedule
            </Link>
            <Link
              href="/nhl/scout-picks"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/nhl/scout-picks") 
                  ? "bg-muted text-primary font-bold" 
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <TrendingUp className={`h-4 w-4 ${isActive("/nhl/scout-picks") ? "text-primary" : ""}`} />
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

