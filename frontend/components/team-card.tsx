import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface TeamRecord {
  wins: number
  losses: number
  ot: number
  points: number
}

interface TeamCardProps {
  name: string
  logo: string
  conference: string
  division: string
  record?: TeamRecord // record may be undefined if not available
}

export function TeamCard({ name, logo, conference, division, record }: TeamCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 bg-primary/5">
        <div className="flex justify-center">
          <Image
            src={logo || "/placeholder.svg"}
            alt={`${name} logo`}
            width={100}
            height={100}
            className="h-24 w-24 object-contain"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-center mb-2">{name}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Conference:</div>
          <div className="font-medium text-right">{conference}</div>
          <div className="text-muted-foreground">Division:</div>
          <div className="font-medium text-right">{division}</div>
          <div className="text-muted-foreground">Record:</div>
          <div className="font-medium text-right">
            {record ? `${record.wins}-${record.losses}-${record.ot}` : "N/A"}
          </div>
          <div className="text-muted-foreground">Points:</div>
          <div className="font-medium text-right">
            {record ? record.points : "N/A"}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">

      </CardFooter>
    </Card>
  )
}
