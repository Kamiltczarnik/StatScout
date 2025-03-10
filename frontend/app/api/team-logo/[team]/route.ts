import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { team: string } }) {
  const team = params.team.toLowerCase()

  try {
    // In a real implementation, this would use the NHL API to fetch team logos
    // For now, we'll redirect to a placeholder
    return NextResponse.redirect(`${request.nextUrl.origin}/placeholder.svg?height=80&width=80&text=${team}`)

    // Example of how you would fetch from NHL API:
    // const response = await fetch(`https://api-web.nhle.com/v1/team/${team}/logo`)
    // if (!response.ok) throw new Error('Failed to fetch team logo')
    // const logoBlob = await response.blob()
    // return new NextResponse(logoBlob, {
    //   headers: { 'Content-Type': response.headers.get('Content-Type') || 'image/svg+xml' }
    // })
  } catch (error) {
    console.error(`Error fetching logo for team ${team}:`, error)
    return NextResponse.redirect(`${request.nextUrl.origin}/placeholder.svg?height=80&width=80&text=${team}`)
  }
}

