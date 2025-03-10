import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real implementation, this would call your Python backend
    const response = await fetch("http://localhost:8000/best-odds/today")

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching today's best odds:", error)
    return NextResponse.json(
      { best_odds_matchups_today: [] },
      { status: 200 }, // Return empty array but with 200 status to handle gracefully on frontend
    )
  }
}

