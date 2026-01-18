import { cookies } from "next/headers"
import { AdminLogin } from "@/components/admin/admin-login"
import { EnquiriesDashboard } from "@/components/admin/enquiries-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - Enquiries | WMB Golf Co.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminEnquiriesPage() {
  // Check if ADMIN_PASSWORD is set
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="bg-background border rounded-lg p-8 max-w-md text-center">
          <h1 className="text-xl font-semibold text-foreground mb-2">Configuration Error</h1>
          <p className="text-muted-foreground">
            The admin password has not been configured. Please set the ADMIN_PASSWORD environment variable.
          </p>
        </div>
      </div>
    )
  }

  // Check authentication
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("admin_auth")
  const isAuthenticated = authCookie?.value === "authenticated"

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return <EnquiriesDashboard />
}
