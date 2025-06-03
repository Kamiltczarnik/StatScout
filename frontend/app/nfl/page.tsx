import Link from "next/link";
import Image from "next/image";
import {
  HopIcon as Hockey,
  Calendar,
  Trophy,
  Users,
  TrendingUp,
} from "lucide-react"; // Consider replacing Hockey with a more generic or NFL-specific icon
import { GiBasketballBasket } from "react-icons/gi";
import { GiHockey } from "react-icons/gi";
import { PiFootballHelmetLight } from "react-icons/pi";
import { IoBaseballOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";

export default function NflHomePage() {
  // Renamed function
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {/* Using PiFootballHelmetLight for NFL icon */}
            <PiFootballHelmetLight className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StatScout - NFL</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary">
              Home
            </Link>
            <Link
              href="/nfl/teams"
              className="text-sm font-medium text-primary">
              {" "}
              {/* Active link for NFL Teams */}
              Teams
            </Link>
            <Link
              href="/nfl/players"
              className="text-sm font-medium text-muted-foreground hover:text-primary">
              Players
            </Link>
            <Link
              href="/nfl/schedule"
              className="text-sm font-medium text-muted-foreground hover:text-primary">
              Schedule
            </Link>
            <Link
              href="/nfl/scout-picks"
              className="text-sm font-medium text-muted-foreground hover:text-primary">
              Scout Picks
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/nfl/teams">Explore NFL Teams</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Your Ultimate NFL Stats & Analytics Hub
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Track your favorite NFL teams and players, analyze game
                  statistics, and stay up-to-date with the latest NFL action.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/nfl/teams">Browse NFL Teams</Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    <Link href="/nfl/players">View NFL Player Stats</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[300px] lg:h-[400px] overflow-hidden rounded-xl">
                <Image
                  src="/NFL.png" // Placeholder NFL image
                  alt="NFL Action"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  NFL Features
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to stay connected with the NFL
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4">
              <div className="grid gap-1 text-center">
                <Trophy className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Team Standings</h3>
                <p className="text-sm text-muted-foreground">
                  Up-to-date standings for all NFL teams
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <Users className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Player Profiles</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed profiles for every NFL player
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <Calendar className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Game Schedule</h3>
                <p className="text-sm text-muted-foreground">
                  Complete NFL schedule with game times
                </p>
              </div>
              <div className="grid gap-1 text-center">
                {/* Updated for NFL Scout Picks */}
                <TrendingUp className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Scout Picks (NFL)</h3>
                <p className="text-sm text-muted-foreground">
                  Data-driven game predictions for NFL
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Get the edge with our NFL Scout Picks
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Our upcoming NFL Scout Picks will analyze various factors to
                  identify potential game advantages. Make smarter picks with
                  StatScout.
                </p>
                <Button asChild>
                  <Link href="/nfl/scout-picks">View NFL Scout Picks</Link>
                </Button>
              </div>
              <div className="relative h-[300px] overflow-hidden rounded-xl">
                {/* You might want a different image for NFL scout picks preview */}
                <Image
                  src="/imgimg.png"
                  alt="NFL Scout Picks Preview"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex flex-col gap-2 md:gap-4 lg:gap-6">
            <div className="flex items-center gap-2">
              {/* Using PiFootballHelmetLight for NFL icon in footer */}
              <PiFootballHelmetLight className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">StatScout</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your all-in-one sports statistics and analytics platform
            </p>
          </div>
          <div className="md:ml-auto grid gap-8 sm:grid-cols-3">
            <div className="grid gap-3 text-sm">
              <h3 className="font-semibold">Platform</h3>
              <nav className="grid gap-3">
                <Link
                  href="/nhl"
                  className="flex items-center gap-2 hover:underline">
                  <span className="inline-block align-middle leading-none">
                    NHL
                  </span>
                  <GiHockey size={20} className="text-black align-middle" />
                </Link>
                <Link
                  href="/nba"
                  className="flex items-center gap-2 hover:underline">
                  <span className="inline-block align-middle leading-none">
                    NBA
                  </span>
                  <GiBasketballBasket
                    size={20}
                    className="text-black align-middle"
                  />
                </Link>
                <Link
                  href="/nfl"
                  className="flex items-center gap-2 hover:underline">
                  <span className="inline-block align-middle leading-none">
                    NFL
                  </span>
                  <PiFootballHelmetLight
                    size={20}
                    className="text-black align-middle"
                  />
                </Link>
                <Link
                  href="/mlb"
                  className="flex items-center gap-2 hover:underline">
                  <span className="inline-block align-middle leading-none">
                    MLB
                  </span>
                  <IoBaseballOutline
                    size={20}
                    className="text-black align-middle"
                  />
                </Link>
              </nav>
            </div>
            <div className="grid gap-3 text-sm">
              <h3 className="font-semibold">Contact</h3>
              <nav className="grid gap-3">
                <p>Kamiltczarnik@gmail.com</p>
                <a
                  href="https://github.com/Kamiltczarnik/StatScout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-500 hover:underline">
                  <i className="fab fa-github mr-2"></i>
                  Source Code
                </a>
                <a
                  href="https://www.linkedin.com/in/kamil-czarnik-269492242/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-500 hover:underline">
                  <i className="fab fa-linkedin mr-2"></i>
                  LinkedIn
                </a>
                <a
                  href="https://kamiltczarnik.com/"
                  className="inline-block text-blue-500 hover:underline">
                  Kamiltczarnik.com
                </a>
              </nav>
            </div>
          </div>
        </div>
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} StatScout. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
