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
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)])
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

    try {
      const formData = new FormData(e.currentTarget)

      const uploadedFilePaths: string[] = []

      for (const file of selectedFiles) {
        const ext = file.name.split(".").pop()
        const name = `${crypto.randomUUID()}.${ext}`
        const path = `enquiries/${name}`

        const { error } = await supabase.storage
          .from("enquiry-uploads")
          .upload(path, file)

        if (error) throw error
        uploadedFilePaths.push(path)
      }

      formData.append("files", JSON.stringify(uploadedFilePaths))

      const response = await fetch("/api/enquiry", {
        method: "POST",
        body: formData,
      })

      const data = await response.json().catch(() => null)

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

  return (
    <>
      <Header />

      <main className="pt-20">
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Get a Quote</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have a question about custom laser engraving or groove refurbishment?
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="p-8">
                {submitStatus === "success" ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Message Sent!</h3>
                    <Button onClick={() => setSubmitStatus("idle")} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <input name="name" placeholder="Name" required disabled={isSubmitting} />
                    <input name="email" type="email" placeholder="Email" required disabled={isSubmitting} />
                    <textarea name="message" required disabled={isSubmitting} />

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      hidden
                      onChange={handleFileChange}
                    />

                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>

                    {submitStatus === "error" && (
                      <p className="text-red-600">{errorMessage}</p>
                    )}
                  </form>
                )}
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
