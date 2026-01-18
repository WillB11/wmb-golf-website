"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"
import { Check } from "lucide-react"

interface ProductConfiguratorProps {
  itemType: "wedges" | "irons" | "putters" | "ball-markers" | "divot-tools" | "bag-tags"
  title: string
  basePrice: number
  image: string
  hasSubTabs?: boolean
}

const patterns = [
  { value: "none", label: "No Pattern" },
  { value: "hexagonal", label: "Hexagonal" },
  { value: "zigzag", label: "Zig Zag" },
  { value: "damascus", label: "Damascus" },
]

const INITIAL_PRICE = 5

export function ProductConfigurator({
  itemType,
  title,
  basePrice,
  image,
  hasSubTabs = false,
}: ProductConfiguratorProps) {
  const [configurationType, setConfigurationType] = useState<"patterns" | "illustrations">("patterns")
  const [pattern, setPattern] = useState("none")
  const [initials, setInitials] = useState("")
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  const initialsPrice = initials.length * INITIAL_PRICE
  const patternPrice = pattern !== "none" ? 15 : 0
  const totalPrice = basePrice + initialsPrice + (configurationType === "patterns" ? patternPrice : 0)

  const displayName = useMemo(() => {
    const parts = [title]
    if (configurationType === "patterns") {
      if (pattern !== "none") parts.push(`${patterns.find((p) => p.value === pattern)?.label} Pattern`)
      if (initials) parts.push(`"${initials.toUpperCase()}"`)
    } else {
      parts.push("Custom Illustration")
    }
    return parts.join(" - ")
  }, [title, configurationType, pattern, initials])

  const handleAddToCart = () => {
    const uniqueId = `${itemType}-${configurationType}-${pattern}-${initials}-${Date.now()}`

    addToCart({
      id: uniqueId,
      name: displayName,
      price: `£${totalPrice}`,
      priceNumber: totalPrice,
      image,
      itemType,
      pattern: configurationType === "patterns" ? pattern : undefined,
      initials: configurationType === "patterns" ? initials : undefined,
      configurationType,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  // Generate pattern overlay SVG
  const getPatternOverlay = () => {
    if (configurationType !== "patterns" || pattern === "none") return null

    const patternStyles: Record<string, React.ReactNode> = {
      hexagonal: (
        <svg
          className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="hex" width="10" height="17.32" patternUnits="userSpaceOnUse">
              <polygon
                points="5,0 10,2.89 10,8.66 5,11.55 0,8.66 0,2.89"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#hex)" />
        </svg>
      ),
      zigzag: (
        <svg
          className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="zigzag" width="20" height="10" patternUnits="userSpaceOnUse">
              <polyline points="0,5 5,0 10,5 15,0 20,5" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#zigzag)" />
        </svg>
      ),
      damascus: (
        <svg
          className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="damascus" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M0,15 Q7.5,0 15,15 T30,15" fill="none" stroke="white" strokeWidth="0.6" />
              <path d="M0,25 Q7.5,10 15,25 T30,25" fill="none" stroke="white" strokeWidth="0.6" />
              <path d="M0,5 Q7.5,-10 15,5 T30,5" fill="none" stroke="white" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#damascus)" />
        </svg>
      ),
    }

    return patternStyles[pattern]
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
            {getPatternOverlay()}
            {/* Initials overlay */}
            {configurationType === "patterns" && initials && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span
                  className="text-white text-6xl font-bold tracking-widest drop-shadow-lg"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  {initials.toUpperCase()}
                </span>
              </div>
            )}
            {/* Illustrations indicator */}
            {configurationType === "illustrations" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 text-white px-6 py-3 rounded-lg">
                  <p className="text-sm">Custom Illustration - Contact for Quote</p>
                </div>
              </div>
            )}
          </div>

          {/* Configuration Panel */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-2xl font-semibold text-primary mb-8">£{totalPrice}</p>

            {/* Sub-tabs for wedges and irons */}
            {hasSubTabs && (
              <div className="mb-8">
                <Label className="text-sm font-medium mb-3 block">Configuration Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={configurationType === "patterns" ? "default" : "outline"}
                    onClick={() => setConfigurationType("patterns")}
                    className="flex-1"
                  >
                    Patterns & Initials
                  </Button>
                  <Button
                    variant={configurationType === "illustrations" ? "default" : "outline"}
                    onClick={() => setConfigurationType("illustrations")}
                    className="flex-1"
                  >
                    Illustrations
                  </Button>
                </div>
                {configurationType === "illustrations" && (
                  <p className="text-sm text-muted-foreground mt-2">
                    For custom illustrations, please contact us for a personalised quote.
                  </p>
                )}
              </div>
            )}

            {/* Pattern selection - only show for patterns configuration */}
            {configurationType === "patterns" && (
              <>
                <div className="mb-6">
                  <Label htmlFor="pattern" className="text-sm font-medium mb-3 block">
                    Pattern (+£15)
                  </Label>
                  <Select value={pattern} onValueChange={setPattern}>
                    <SelectTrigger id="pattern" className="w-full">
                      <SelectValue placeholder="Select a pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      {patterns.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Initials input */}
                <div className="mb-8">
                  <Label htmlFor="initials" className="text-sm font-medium mb-3 block">
                    Initials (£5 per letter)
                  </Label>
                  <Input
                    id="initials"
                    type="text"
                    placeholder="Enter your initials"
                    value={initials}
                    onChange={(e) => setInitials(e.target.value.slice(0, 5))}
                    maxLength={5}
                    className="uppercase"
                  />
                  {initials && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {initials.length} letter{initials.length !== 1 ? "s" : ""} = £{initialsPrice}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Price breakdown */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-3">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base price</span>
                  <span>£{basePrice}</span>
                </div>
                {configurationType === "patterns" && pattern !== "none" && (
                  <div className="flex justify-between">
                    <span>{patterns.find((p) => p.value === pattern)?.label} pattern</span>
                    <span>£15</span>
                  </div>
                )}
                {configurationType === "patterns" && initials && (
                  <div className="flex justify-between">
                    <span>
                      Initials ({initials.length} letter{initials.length !== 1 ? "s" : ""})
                    </span>
                    <span>£{initialsPrice}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>£{totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Add to basket button */}
            {configurationType === "patterns" ? (
              <Button size="lg" onClick={handleAddToCart} className="w-full" disabled={added}>
                {added ? (
                  <>
                    <Check className="mr-2 h-5 w-5" /> Added to Basket
                  </>
                ) : (
                  "Add to Basket"
                )}
              </Button>
            ) : (
              <Button size="lg" asChild className="w-full">
                <a href="/contact">Get a Quote for Illustration</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
