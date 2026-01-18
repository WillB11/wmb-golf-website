import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return NextResponse.json({ error: "Admin password not configured" }, { status: 500 })
  }

  const { password } = await request.json()

  if (password === adminPassword) {
    const cookieStore = await cookies()
    // Set httpOnly cookie that expires in 24 hours
    cookieStore.set("admin_auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_auth")
  return NextResponse.json({ success: true })
}
