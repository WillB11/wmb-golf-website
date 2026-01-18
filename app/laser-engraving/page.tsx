"use client"

import type React from "react"

import { useState, useMemo, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"
import { Check, Upload, X, AlertTriangle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import ScrollToTopLink from "@/components/scroll-to-top-link"

const WEDGE_ENGRAVING_PRICE = 30
const NAME_PRICE = 5 // Declared NAME_PRICE variable
const PATTERN_PRICE = 10 // Declared PATTERN_PRICE variable
const CLUB_RETURN_POSTAGE = 5 // Declared CLUB_RETURN_POSTAGE variable

// Ball marker colour options with images
const ballMarkerColours = [
  { value: "silver", label: "Silver", image: "/ball-marker-silver.jpg" },
  { value: "brass", label: "Brass", image: "/ball-marker-brass.jpg" },
  { value: "copper", label: "Copper", image: "/ball-marker-copper.jpg" },
  { value: "black", label: "Black", image: "/ball-marker-black.jpg" },
]

const categories = [
  {
    id: "wedges",
    name: "Wedges",
    basePrice: PATTERN_PRICE,
    hasSubTabs: true, // Only wedges have Patterns and Custom Design tabs
    hasLogoUpload: false,
    image: "/golf-wedge-club-head-silver-metal-close-up.jpg",
  },
  {
    id: "ball-markers",
    name: "Ball Markers",
    basePrice: 4.99,
    hasSubTabs: false,
    hasLogoUpload: true,
    hasColourOption: true,
    image: "/ball-marker-silver.jpg",
  },
  {
    id: "divot-tools",
    name: "Divot Tools",
    basePrice: 7.99,
    hasSubTabs: false,
    hasLogoUpload: true,
    image: "/golf-divot-tool-metal-close-up.jpg",
  },
  {
    id: "bag-tags",
    name: "Bag Tags",
    basePrice: 7.99,
    hasSubTabs: false,
    hasLogoUpload: true,
    image: "/golf-bag-tag-leather-metal-close-up.jpg",
  },
  {
    id: "irons",
    name: "Irons",
    basePrice: 0,
    hasSubTabs: false, // Irons only have custom design
    hasLogoUpload: false,
    customDesignOnly: true,
    disclaimer: "Please note: Irons cannot be cavity back. If you are unsure, please send a quote form instead.",
    image: "/golf-iron-club-head-close-up-metal.jpg",
  },
  {
    id: "putters",
    name: "Putters",
    basePrice: 0,
    hasSubTabs: false, // Putters only have custom design
    hasLogoUpload: false,
    customDesignOnly: true,
    image: "/golf-putter-head-close-up-metal.jpg",
  },
]

const patterns = [
  { value: "none", label: "No Pattern" },
  { value: "hexagonal", label: "Hexagonal" },
  { value: "zigzag", label: "Zig Zag" },
  { value: "damascus", label: "Damascus" },
]

const fonts = [
  { value: "times-new-roman", label: "Times New Roman", fontFamily: "'Times New Roman', serif" },
  { value: "arial", label: "Arial", fontFamily: "Arial, sans-serif" },
  { value: "georgia", label: "Georgia", fontFamily: "Georgia, serif" },
  { value: "verdana", label: "Verdana", fontFamily: "Verdana, sans-serif" },
  { value: "courier-new", label: "Courier New", fontFamily: "'Courier New', monospace" },
]

export default function LaserEngravingPage() {
  const [activeCategory, setActiveCategory] = useState("wedges")
  const [configurationType, setConfigurationType] = useState<"patterns" | "custom">("patterns")
  const [pattern, setPattern] = useState("none")
  const [initials, setInitials] = useState("")
  const [selectedFont, setSelectedFont] = useState("times-new-roman")
  const [added, setAdded] = useState(false)
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null)
  const [logoFileName, setLogoFileName] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [accessoryChoice, setAccessoryChoice] = useState<"initials" | "logo" | "name" | "initials-logo" | "name-logo">("initials")
  const [ballMarkerColour, setBallMarkerColour] = useState("silver")
  const [name, setName] = useState("") // Declared name variable
  const [nameFont, setNameFont] = useState("times-new-roman") // Declared nameFont variable
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToCart } = useCart()

  const currentCategory = categories.find((c) => c.id === activeCategory)!

  const isAccessory = currentCategory.hasLogoUpload
  const isClub = ["wedges", "irons", "putters"].includes(activeCategory)
  const isWedge = activeCategory === "wedges"
  const isCustomDesignOnly = (currentCategory as any).customDesignOnly === true
  const isBallMarker = activeCategory === "ball-markers"
  const isBagTag = activeCategory === "bag-tags"

  // For wedges: £30 per wedge when pattern is selected, £0 otherwise
  const wedgePrice = isWedge && pattern !== "none" ? WEDGE_ENGRAVING_PRICE : 0

  // For accessories, total = base price only (postage charged at checkout via Shopify)
  // For clubs (wedges), total = wedge engraving price only (shipping at checkout)
  const subtotal = isAccessory ? currentCategory.basePrice : wedgePrice
  const totalPrice = subtotal

  // Get the current image for ball markers based on colour selection
  const currentImage = isBallMarker
    ? ballMarkerColours.find((c) => c.value === ballMarkerColour)?.image || currentCategory.image
    : currentCategory.image

  const currentFontLabel = fonts.find((f) => f.value === selectedFont)?.label || ""

  const displayName = useMemo(() => {
    const parts = [currentCategory.name]
    if (isAccessory) {
      if (isBallMarker) {
        const colourLabel = ballMarkerColours.find((c) => c.value === ballMarkerColour)?.label
        parts.push(colourLabel || "Silver")
      }
      if (initials && accessoryChoice === "initials") parts.push(`"${initials.toUpperCase()}" (${currentFontLabel})`)
      if (uploadedLogo && accessoryChoice === "logo") parts.push("Custom Logo")
      if (name && accessoryChoice === "name") parts.push(`"${name.toUpperCase()}" (${currentFontLabel})`)
    } else if (isWedge && configurationType === "patterns") {
      if (pattern !== "none") parts.push(`${patterns.find((p) => p.value === pattern)?.label} Pattern`)
    } else {
      parts.push("Custom Design")
    }
    return parts.join(" - ")
  }, [
    currentCategory.name,
    configurationType,
    pattern,
    initials,
    uploadedLogo,
    isAccessory,
    accessoryChoice,
    currentFontLabel,
    isBallMarker,
    ballMarkerColour,
    name,
    isWedge,
  ])

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    setPattern("none")
    setInitials("")
    setConfigurationType("patterns")
    setUploadedLogo(null)
    setLogoFileName(null)
    setLogoFile(null)
    setAccessoryChoice("initials")
    setSelectedFont("times-new-roman")
    setBallMarkerColour("silver")
    setName("") // Reset name when category changes
    setNameFont("times-new-roman") // Reset nameFont when category changes
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFileName(file.name)
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setUploadedLogo(null)
    setLogoFileName(null)
    setLogoFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddToCart = async () => {
    const uniqueId = `${activeCategory}-${configurationType}-${pattern}-${initials}-${ballMarkerColour}-${selectedFont}-${Date.now()}`

    // Send logo file if uploaded
    if (logoFile && accessoryChoice === "logo") {
      try {
        const formData = new FormData()
        formData.append("logo", logoFile)
        formData.append("productName", displayName)
        formData.append("category", currentCategory.name)
        formData.append("orderId", uniqueId)

        await fetch("/api/send-logo", {
          method: "POST",
          body: formData,
        })
      } catch (error) {
        // Silent fail - logo will be referenced in order
      }
    }

    // Build cart item - only include relevant properties
    const cartItem: Record<string, any> = {
      id: uniqueId,
      name: displayName,
      price: `£${totalPrice.toFixed(2)}`,
      priceNumber: totalPrice,
      image: currentImage,
      itemType: activeCategory,
    }

    // For wedges, include pattern and configuration type
    if (isWedge) {
      if (configurationType === "patterns" && pattern !== "none") {
        cartItem.pattern = pattern
      }
      cartItem.configurationType = configurationType
    }

    // For accessories, only include what was selected
    if (isAccessory) {
      if (accessoryChoice === "initials" && initials) {
        cartItem.initials = initials
        cartItem.font = selectedFont
      }
      if (accessoryChoice === "logo" && uploadedLogo) {
        cartItem.hasLogo = true
        cartItem.logoFileName = logoFileName
      }
      if (isBallMarker) {
        cartItem.colour = ballMarkerColour
      }
      if (accessoryChoice === "name" && name) {
        cartItem.name = name
        cartItem.nameFont = nameFont
      }
    }

    addToCart(cartItem)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const getPatternOverlay = () => {
    if (isAccessory) return null
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

  const showInitialsOverlay = isAccessory ? accessoryChoice === "initials" && initials : initials

  const showLogoOverlay = isAccessory ? accessoryChoice === "logo" && uploadedLogo : false

  const showNameOverlay = isAccessory ? accessoryChoice === "name" && name : false // Declared showNameOverlay variable

  const currentFontFamily = fonts.find((f) => f.value === selectedFont)?.fontFamily || "'Times New Roman', serif"

  const nameFontFamily = fonts.find((f) => f.value === nameFont)?.fontFamily || "'Times New Roman', serif"

  const formattedInitials = useMemo(() => {
    if (!initials) return ""
    const chars = initials.toUpperCase().split("")
    return chars.join(".")
  }, [initials])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="bg-muted/50 border-b">
          <div className="container mx-auto px-6 py-6">
            {/* Category Tabs - centered */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-6 py-3 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    activeCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-white text-foreground hover:bg-primary/10"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {currentCategory.disclaimer && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 text-sm">{currentCategory.disclaimer}</p>
                <ScrollToTopLink
                  href="/contact"
                  className="text-amber-700 underline text-sm font-medium hover:text-amber-900"
                >
                  Send a quote form
                </ScrollToTopLink>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden">
              <Image
                src={currentImage || "/placeholder.svg"}
                alt={currentCategory.name}
                fill
                className="object-cover"
                priority
              />
              {getPatternOverlay()}
              {/* Initials overlay */}
              {showInitialsOverlay && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span
                    className="text-white text-6xl font-bold tracking-widest drop-shadow-lg"
                    style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                      fontFamily: currentFontFamily,
                    }}
                  >
                    {formattedInitials}
                  </span>
                </div>
              )}

              {/* Uploaded logo overlay */}
              {showLogoOverlay && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 relative">
                    <Image
                      src={uploadedLogo || "/placeholder.svg"}
                      alt="Uploaded logo"
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
              )}
              {/* Custom design indicator - for irons, putters, and wedges with custom tab */}
              {(isCustomDesignOnly || (isWedge && configurationType === "custom")) && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 text-white px-6 py-3 rounded-lg">
                    <p className="text-sm">Custom Design - Contact for Quote</p>
                  </div>
                </div>
              )}
            </div>

            {/* Configuration Panel */}
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold text-foreground mb-2">Laser Engraved {currentCategory.name}</h2>

              {isClub && (
                <p className="text-muted-foreground mb-4">
                  Ship us your {currentCategory.name.toLowerCase()} and we'll engrave them with your chosen design and
                  send them back to you.
                </p>
              )}

              {isAccessory ? (
                <p className="text-2xl font-semibold text-primary mb-4">
                  £{currentCategory.basePrice.toFixed(2)}
                </p>
              ) : isWedge && configurationType === "patterns" ? (
                <p className="text-lg text-muted-foreground mb-4">
                  £{WEDGE_ENGRAVING_PRICE.toFixed(2)} per wedge when pattern selected
                </p>
              ) : null}

              {/* Sub-tabs for wedges only (Patterns vs Custom Design) */}
              {isWedge && (
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Configuration Type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={configurationType === "patterns" ? "default" : "outline"}
                      onClick={() => setConfigurationType("patterns")}
                      className="flex-1"
                    >
                      Patterns
                    </Button>
                    <Button
                      variant={configurationType === "custom" ? "default" : "outline"}
                      onClick={() => setConfigurationType("custom")}
                      className="flex-1"
                    >
                      Custom Design
                    </Button>
                  </div>
                </div>
              )}

              {/* Custom Design Only content for irons and putters */}
              {isCustomDesignOnly && (
                <div className="bg-muted/50 rounded-lg p-6 mb-4">
                  <p className="text-muted-foreground mb-4">
                    For custom designs, get in touch and tell us about your vision!
                  </p>
                  <Button asChild className="w-full">
                    <ScrollToTopLink href="/contact">Get a Quote</ScrollToTopLink>
                  </Button>
                </div>
              )}

              {/* Custom Design tab content for wedges */}
              {isWedge && configurationType === "custom" && (
                <div className="bg-muted/50 rounded-lg p-6 mb-4">
                  <p className="text-muted-foreground mb-4">
                    For custom designs, get in touch and tell us about your vision!
                  </p>
                  <Button asChild className="w-full">
                    <ScrollToTopLink href="/contact">Get a Quote</ScrollToTopLink>
                  </Button>
                </div>
              )}

              {/* Accessories configuration (ball markers, divot tools, bag tags) */}
              {isAccessory && (
                <>
                  {/* Ball marker colour selector */}
                  {isBallMarker && (
                    <div className="mb-3">
                      <Label className="text-sm font-medium mb-2 block">Colour</Label>
                      <Select value={ballMarkerColour} onValueChange={setBallMarkerColour}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select colour" />
                        </SelectTrigger>
                        <SelectContent>
                          {ballMarkerColours.map((colour) => (
                            <SelectItem key={colour.value} value={colour.value}>
                              {colour.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Personalisation type - Initials or Logo only */}
                  <div className="mb-3">
                    <Label className="text-sm font-medium mb-2 block">Choose Personalisation Type</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={accessoryChoice === "initials" ? "default" : "outline"}
                        onClick={() => {
                          setAccessoryChoice("initials")
                          setUploadedLogo(null)
                          setLogoFileName(null)
                          setLogoFile(null)
                        }}
                        className="flex-1"
                      >
                        Initials
                      </Button>
                      <Button
                        variant={accessoryChoice === "logo" ? "default" : "outline"}
                        onClick={() => {
                          setAccessoryChoice("logo")
                          setInitials("")
                        }}
                        className="flex-1"
                      >
                        Logo / Image
                      </Button>
                    </div>
                  </div>

                  {/* Initials input for accessories */}
                  {accessoryChoice === "initials" && (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">Initials (max 2 characters)</Label>
                        <Input
                          placeholder="Example: W.B"
                          value={initials}
                          onChange={(e) => setInitials(e.target.value.slice(0, 2))}
                          maxLength={2}
                          className="uppercase"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">Font Style</Label>
                        <Select value={selectedFont} onValueChange={setSelectedFont}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            {fonts.map((font) => (
                              <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.fontFamily }}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Logo upload for accessories */}
                  {accessoryChoice === "logo" && (
                    <div className="mb-3">
                      <Label className="text-sm font-medium mb-1.5 block">Upload Logo / Image</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,.pdf,.svg"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        {uploadedLogo ? (
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-12 h-12 relative">
                              <Image
                                src={uploadedLogo || "/placeholder.svg"}
                                alt="Uploaded logo"
                                fill
                                className="object-contain rounded"
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{logoFileName}</span>
                            <Button variant="ghost" size="sm" onClick={removeLogo}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <label htmlFor="logo-upload" className="cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload your logo or image</p>
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price breakdown for accessories */}
                  <div className="border-t pt-3 mb-3">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>£{totalPrice.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Postage calculated at checkout</p>
                    </div>
                  </div>

                  <Button onClick={handleAddToCart} className="w-full" disabled={added}>
                    {added ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Added to Basket
                      </>
                    ) : (
                      "Add to Basket"
                    )}
                  </Button>
                </>
              )}

              {/* Club configuration (wedges only with patterns selected) */}
              {isWedge && configurationType === "patterns" && (
                <>
                  <div className="mb-3">
                    <Label className="text-sm font-medium mb-1.5 block">Pattern</Label>
                    <Select value={pattern} onValueChange={setPattern}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pattern" />
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

                  {/* Price breakdown for wedges */}
                  <div className="border-t pt-3 mb-3">
                    <div className="space-y-1 text-sm">
                      {pattern !== "none" && (
                        <div className="flex justify-between">
                          <span>{patterns.find((p) => p.value === pattern)?.label} Pattern</span>
                          <span>£{WEDGE_ENGRAVING_PRICE.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-base pt-2 border-t">
                        <span>Total</span>
                        <span>£{totalPrice.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Shipping calculated at checkout</p>
                    </div>
                  </div>

                  <Button onClick={handleAddToCart} className="w-full" disabled={added || pattern === "none"}>
                    {added ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Added to Basket
                      </>
                    ) : (
                      "Add to Basket"
                    )}
                  </Button>
                </>
              )}


            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
