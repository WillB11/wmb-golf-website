import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const logo = formData.get("logo") as File
    const productName = formData.get("productName") as string
    const category = formData.get("category") as string
    const orderId = formData.get("orderId") as string

    if (!logo) {
      return NextResponse.json({ error: "No logo file provided" }, { status: 400 })
    }

    // Convert file to base64 for email attachment
    const bytes = await logo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Logo = buffer.toString("base64")

    // Send email notification with the logo attached
    // Using a simple email service - in production you'd use SendGrid, Resend, etc.
    const emailContent = {
      to: "info@wmbgolfco.com",
      subject: `New Logo Upload - ${category} Order`,
      html: `
        <h2>New Logo/Image Upload</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>File Name:</strong> ${logo.name}</p>
        <p><strong>File Size:</strong> ${(logo.size / 1024).toFixed(2)} KB</p>
        <p>The logo/image file is attached to this email.</p>
      `,
      attachments: [
        {
          filename: logo.name,
          content: base64Logo,
          encoding: "base64",
          contentType: logo.type,
        },
      ],
    }

    // Log the order for now (in production, integrate with email service)
    console.log("[v0] Logo upload received:", {
      orderId,
      productName,
      category,
      fileName: logo.name,
      fileSize: logo.size,
    })

    // In production, you would send this via an email service like:
    // await resend.emails.send(emailContent)
    // For now, we store it and log it

    return NextResponse.json({
      success: true,
      message: "Logo received and will be processed with your order",
      orderId,
    })
  } catch (error) {
    console.error("[v0] Error processing logo upload:", error)
    return NextResponse.json({ error: "Failed to process logo" }, { status: 500 })
  }
}
