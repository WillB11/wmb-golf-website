import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

const ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg", "image/svg+xml", "application/pdf"]
const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "svg", "pdf"]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const service = formData.get("service") as string
    const message = formData.get("message") as string
    const pageUrl = formData.get("pageUrl") as string

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: enquiryData, error: insertError } = await supabase
      .from("enquiries")
      .insert({
        name,
        email,
        service: service || null,
        message: message || null,
        file_urls: null,
        page_url: pageUrl || null,
      })
      .select("id")
      .single()

    if (insertError || !enquiryData) {
      console.error("Database insert error:", insertError)
      return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 })
    }

    const enquiryId = enquiryData.id

    const files = formData.getAll("files") as File[]
    const fileUrls: string[] = []

    for (const file of files) {
      if (file && file.size > 0) {
        // Validate file size (10MB max)
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json({ error: `File ${file.name} exceeds 10MB limit` }, { status: 400 })
        }

        // Validate file type
        const fileExt = file.name.split(".").pop()?.toLowerCase()
        if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
          return NextResponse.json(
            { error: `File ${file.name} has invalid type. Allowed: png, jpg, jpeg, svg, pdf` },
            { status: 400 },
          )
        }

        if (!ALLOWED_TYPES.includes(file.type) && file.type !== "") {
          return NextResponse.json({ error: `File ${file.name} has invalid MIME type` }, { status: 400 })
        }

        const timestamp = Date.now()
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
        const filePath = `enquiries/${enquiryId}/${timestamp}-${sanitizedFilename}`

        const { error: uploadError } = await supabase.storage.from("enquiry-uploads").upload(filePath, file, {
          contentType: file.type || `image/${fileExt}`,
          upsert: false,
        })

        if (uploadError) {
          console.error("Upload error:", uploadError)
          // Continue without this file but log the error
          continue
        }

        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage.from("enquiry-uploads").getPublicUrl(filePath)

        if (urlData?.publicUrl) {
          fileUrls.push(urlData.publicUrl)
        }
      }
    }

    if (fileUrls.length > 0) {
      const { error: updateError } = await supabase
        .from("enquiries")
        .update({ file_urls: fileUrls })
        .eq("id", enquiryId)

      if (updateError) {
        console.error("Database update error:", updateError)
        // Don't fail the request, enquiry was saved, just without file URLs
      }
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiryId,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
