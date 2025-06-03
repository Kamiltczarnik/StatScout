import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";

// NFL specific team record
interface NflTeamRecord {
  wins: number;
  losses: number;
  ties: number;
}

interface NflTeamCardProps {
  name: string;
  logo: string; // URL or path to the logo
  conference: string;
  division: string; // This should be the specific part like "East", "North"
  record?: NflTeamRecord; // NFL record (W-L-T)
  // Points are typically calculated or might come from a separate source if needed here
  // For NFL, points are not usually displayed on a team card like in NHL, WLT is primary.
}

export function NflTeamCard({
  name,
  logo,
  conference,
  division,
  record,
}: NflTeamCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="p-4 bg-muted/30 dark:bg-muted/20">
        <div className="flex justify-center items-center h-28">
          {" "}
          {/* Fixed height for logo area */}
          <Image
            src={logo || "/assets/logos/nfl/placeholder.png"} // Generic placeholder for NFL
            alt={`${name} logo`}
            width={100}
            height={100}
            className="object-contain max-h-full max-w-full"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <h3
          className="text-lg font-bold text-center mb-2 truncate"
          title={name}>
          {name}
        </h3>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
          <div className="text-muted-foreground">Conference:</div>
          <div className="font-medium text-right truncate">{conference}</div>
          <div className="text-muted-foreground">Division:</div>
          <div className="font-medium text-right truncate">{division}</div>{" "}
          {/* e.g. East, North */}
          <div className="text-muted-foreground">Record:</div>
          <div className="font-medium text-right">
            {record ? `${record.wins}-${record.losses}-${record.ties}` : "N/A"}
          </div>
        </div>
      </CardContent>
      {/* CardFooter can be used for links or actions later if needed */}
      {/* <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full">View Details</Button>
      </CardFooter> */}
    </Card>
  );
}
