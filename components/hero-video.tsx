"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroVideo() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video placeholder with dark overlay */}
      <div className="absolute inset-0">
        <Image
          src="/close-up-laser-engraving-machine-precision-engravi.jpg"
          alt="Laser engraving precision golf club"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <Image src="/images/wmb-logo-white.png" alt="WMB Golf Co. logo" width={700} height={700} priority />
        <p className="-mt-16 mb-2 max-w-5xl text-lg text-white/90 md:text-xl leading-relaxed">
          Custom laser engraved golf clubs, ball markers, and bespoke golf accessories.
        </p>
        <p className="mb-8 text-sm text-white/80 md:text-base text-center">
          Proudly made in England for golfers, by golfers.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row justify-center items-center">
          <Button asChild size="lg" className="bg-primary text-white hover:bg-accent px-12">
            <Link href="/laser-engraving">Custom Engraving Configurator</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-foreground bg-transparent px-12"
          >
            <Link href="/contact">Get a Quote</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
