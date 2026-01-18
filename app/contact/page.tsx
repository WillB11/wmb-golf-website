"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Instagram, Upload, X, CheckCircle, Loader2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    

   
const uploadedFilePaths: string[] = []

for (const file of selectedFiles) {
  const fileExt = file.name.split(".").pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const filePath = `enquiries/${fileName}`

  const { error } = await supabase.storage
    .from("enquiry-uploads") // 👈 CHANGE THIS IF NEEDED
    .upload(filePath, file)

  if (error) {
    throw error
  }

  uploadedFilePaths.push(filePath)
}

    try {
  const response = await fetch("/api/enquiry", {
    method: "POST",
    body: formData, // ✅ FormData for images
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to submit enquiry")
  }

  setSubmitStatus("success")
  setSelectedFiles([])
  formRef.current?.reset()
try {
  const response = await fetch("/api/enquiry", {
    method: "POST",
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error || "Failed to submit enquiry")
  }

  setSubmitStatus("success")
  setSelectedFiles([])
  formRef.current?.reset()
} catch (err: any) {
  console.error(err)
  setErrorMessage(err?.message || "Something went wrong")
  setSubmitStatus("error")
} finally {
  setIsSubmitting(false)
}
    }
  

      
  
  }
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Get a Quote</h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Have a question about custom laser engraving or groove refurbishment? We'd love to hear from you.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Form */}
              <Card className="p-8">
                <h2 className="text-2xl font-light tracking-wide mb-6">Send a Message</h2>

                {submitStatus === "success" ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for your enquiry. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setSubmitStatus("idle")} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-2 border border-input rounded bg-background"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-2 border border-input rounded bg-background"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium mb-2">
                        Service
                      </label>
                      <select
                        id="service"
                        name="service"
                        className="w-full px-4 py-2 border border-input rounded bg-background"
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select a service</option>
                        <option value="laser-engraving-clubs">Laser Engraving Clubs</option>
                        <option value="groove-refurbishment">Groove Refurbishment</option>
                        <option value="laser-engraving-accessories">
                          Laser Engraving Accessories (ball markers, divot tools, bag tags)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Tell us more about what you want
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="w-full px-4 py-2 border border-input rounded bg-background"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="files" className="block text-sm font-medium mb-2">
                        Attach Photos
                      </label>
                      <p className="text-xs text-muted-foreground mb-3">
                        Upload photos of your clubs, graphics, logos, or reference images
                      </p>
                      <div
                        className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          id="files"
                          ref={fileInputRef}
                          multiple
                          accept="image/*,.pdf,.svg"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={isSubmitting}
                        />
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG, PDF (max 10MB each)</p>
                      </div>

                      {/* Selected files list */}
                      {selectedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                              <span className="truncate flex-1">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="ml-2 text-muted-foreground hover:text-foreground"
                                disabled={isSubmitting}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {submitStatus === "error" && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {errorMessage}
                      </div>
                    )}

                    <Button type="submit" className="w-full bg-primary hover:bg-accent" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                )}
              </Card>

              {/* Contact Info */}
              <div className="space-y-6">
                <Card className="p-8">
                  <h2 className="text-2xl font-light tracking-wide mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium mb-1">Email</h3>
                        <a
                          href="mailto:info@wmbgolfco.com"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          info@wmbgolfco.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Instagram className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium mb-1">Instagram</h3>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                          @wmbgolfco
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 bg-secondary">
                  <h3 className="text-lg font-medium mb-4">Response Time</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We typically respond to enquiries within 24 hours during business days. For urgent custom laser
                    engraving requests, please mention this in your message.
                  </p>
                </Card>

                <Card className="p-8 bg-primary text-white">
                  <h3 className="text-lg font-medium mb-4">Based in the UK</h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    All laser engraving and groove refurbishment work is completed in our UK workshop, ensuring the
                    highest quality standards and fast turnaround times.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
