"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, LogOut, Search, Mail, Calendar, FileText, X } from "lucide-react"
import Image from "next/image"

interface Enquiry {
  id: string
  created_at: string
  name: string
  email: string
  service: string
  message: string
  file_urls: string[] | null
  page_url: string | null
}

interface Stats {
  total: number
  last7Days: number
  mostCommonService: string
}

export function EnquiriesDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, last7Days: 0, mostCommonService: "N/A" })
  const [services, setServices] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [serviceFilter, setServiceFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const fetchEnquiries = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (serviceFilter) params.set("service", serviceFilter)
      params.set("page", page.toString())

      const response = await fetch(`/api/admin/enquiries?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEnquiries(data.enquiries || [])
        setStats(data.stats)
        setServices(data.services || [])
        setTotalPages(data.totalPages || 1)
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error)
    } finally {
      setLoading(false)
    }
  }, [search, serviceFilter, page])

  useEffect(() => {
    fetchEnquiries()
  }, [fetchEnquiries])

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    window.location.reload()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchEnquiries()
  }

  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(url)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Enquiries</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-background border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Enquiries</p>
            <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-background border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Last 7 Days</p>
            <p className="text-2xl font-semibold text-foreground">{stats.last7Days}</p>
          </div>
          <div className="bg-background border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Most Common Service</p>
            <p className="text-lg font-semibold text-foreground truncate">{stats.mostCommonService}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-background border rounded-lg p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={serviceFilter}
              onValueChange={(value) => {
                setServiceFilter(value === "all" ? "" : value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Enquiries List */}
        <div className="bg-background border rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading enquiries...</div>
          ) : enquiries.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No enquiries found</div>
          ) : (
            <div className="divide-y">
              {enquiries.map((enquiry) => (
                <div key={enquiry.id} className="hover:bg-muted/30">
                  {/* Row Header */}
                  <button
                    onClick={() => setExpandedId(expandedId === enquiry.id ? null : enquiry.id)}
                    className="w-full p-4 flex items-center gap-4 text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground truncate">{enquiry.name}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {enquiry.service}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3" />
                          {enquiry.email}
                        </span>
                        <span className="flex items-center gap-1 hidden sm:flex">
                          <Calendar className="w-3 h-3" />
                          {formatDate(enquiry.created_at)}
                        </span>
                        {enquiry.file_urls && enquiry.file_urls.length > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {enquiry.file_urls.length} file(s)
                          </span>
                        )}
                      </div>
                    </div>
                    {expandedId === enquiry.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {/* Expanded Content */}
                  {expandedId === enquiry.id && (
                    <div className="px-4 pb-4 border-t bg-muted/20">
                      <div className="pt-4 space-y-4">
                        {/* Date on mobile */}
                        <p className="text-sm text-muted-foreground sm:hidden">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(enquiry.created_at)}
                        </p>

                        {/* Message */}
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">Message</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{enquiry.message}</p>
                        </div>

                        {/* Page URL */}
                        {enquiry.page_url && (
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Submitted From</p>
                            <p className="text-sm text-muted-foreground">{enquiry.page_url}</p>
                          </div>
                        )}

                        {/* Attachments */}
                        {enquiry.file_urls && enquiry.file_urls.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">Attachments</p>
                            <div className="flex flex-wrap gap-2">
                              {enquiry.file_urls.map((url, index) =>
                                isImageUrl(url) ? (
                                  <button
                                    key={index}
                                    onClick={() => setPreviewImage(url)}
                                    className="relative w-20 h-20 rounded border overflow-hidden hover:opacity-80 transition-opacity"
                                  >
                                    <Image
                                      src={url || "/placeholder.svg"}
                                      alt={`Attachment ${index + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </button>
                                ) : (
                                  <a
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 bg-background border rounded text-sm text-foreground hover:bg-muted transition-colors"
                                  >
                                    <FileText className="w-4 h-4" />
                                    File {index + 1}
                                  </a>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t p-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={previewImage || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
