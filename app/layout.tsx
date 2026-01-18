import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/lib/cart-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WMB Golf Co. | UK Custom Laser Engraved Golf Clubs & Bespoke Golf Accessories",
  description:
    "UK based custom laser engraved golf clubs, ball markers, and bespoke golf accessories. High-quality finishes and personalised designs built for golfers who care about detail.",
  keywords: [
    "custom golf clubs",
    "laser engraved golf clubs",
    "custom laser engraving golf",
    "personalised golf clubs",
    "bespoke golf accessories",
    "custom ball markers",
    "engraved golf clubs",
    "custom golf engraving",
    "golf club laser engraving",
    "engraved golf wedges",
    "golf club engraving UK",
    "UK golf club engraving",
    "UK custom golf clubs",
    "UK laser engraving golf",
    "UK bespoke golf accessories",
  ],
  generator: "v0.app",
  icons: {
    icon: "/images/wmb-logo-white.png",
    apple: "/images/wmb-logo-white.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <CartProvider>{children}</CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
