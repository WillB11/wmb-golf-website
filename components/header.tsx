"use client"

import type React from "react"

import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems } = useCart()

  const isHomepage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const getTextColor = () => {
    if (scrolled) return "text-foreground"
    if (isHomepage) return "text-white"
    return "text-foreground"
  }

  const textColorClass = getTextColor()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: "instant" })
    router.push(href)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/laser-engraving", label: "Custom Engraving Configurator" },
    { href: "/custom-laser-engraving", label: "What Can We Engrave?" },
    { href: "/golf-groove-refurbishment", label: "Groove Refurbishment" },
    { href: "/contact", label: "Get a Quote" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden ${scrolled || mobileMenuOpen ? "text-foreground" : isHomepage ? "text-white" : "text-foreground"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Spacer for desktop */}
          <div className="hidden md:block w-8 h-8" />

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm tracking-wide hover:text-primary transition-colors ${textColorClass}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link href="/basket" onClick={(e) => handleNavClick(e, "/basket")}>
            <Button
              variant="ghost"
              size="icon"
              className={`relative ${
                scrolled
                  ? "text-foreground"
                  : isHomepage
                    ? "text-white hover:bg-white/10"
                    : "text-foreground hover:bg-foreground/10" // Updated cart icon to use black on non-homepage when not scrolled
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Shopping cart</span>
            </Button>
          </Link>
        </nav>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-foreground text-base py-2 border-b border-muted hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
