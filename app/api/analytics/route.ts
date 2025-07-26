import { NextResponse } from "next/server"
import { getChatMetrics } from "@/lib/analytics"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const metrics = await getChatMetrics(days)

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Error fetching analytics" }, { status: 500 })
  }
}
