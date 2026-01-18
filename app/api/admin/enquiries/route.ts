import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  // Check authentication
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("admin_auth")

  if (authCookie?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const service = searchParams.get("service") || ""
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = 20

  try {
    const supabase = createAdminClient()

    // Build query
    let query = supabase.from("enquiries").select("*", { count: "exact" }).order("created_at", { ascending: false })

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`)
    }

    // Apply service filter
    if (service) {
      query = query.eq("service", service)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: enquiries, error, count } = await query

    if (error) throw error

    // Get stats
    const { data: allEnquiries } = await supabase.from("enquiries").select("service, created_at")

    const total = allEnquiries?.length || 0
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const last7Days = allEnquiries?.filter((e) => new Date(e.created_at) > sevenDaysAgo).length || 0

    // Calculate most common service
    const serviceCounts: Record<string, number> = {}
    allEnquiries?.forEach((e) => {
      if (e.service) {
        serviceCounts[e.service] = (serviceCounts[e.service] || 0) + 1
      }
    })
    const mostCommonService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

    // Get unique services for filter dropdown
    const services = [...new Set(allEnquiries?.map((e) => e.service).filter(Boolean))]

    return NextResponse.json({
      enquiries,
      total: count || 0,
      stats: {
        total,
        last7Days,
        mostCommonService,
      },
      services,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error("Error fetching enquiries:", error)
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 })
  }
}
