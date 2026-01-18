"use client"

import { Button } from "@/components/ui/button"
import { ScrollToTopLink } from "@/components/scroll-to-top-link"

export function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto text-center">
        <h2 className="mb-6 text-3xl font-light tracking-wide md:text-4xl text-balance">
          Ready to customise your clubs?
        </h2>
        <p className="mb-8 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance">
          Configure your custom laser engraving or get in touch to discuss a bespoke project
        </p>
        <div className="flex flex-col gap-4 sm:flex-row justify-center">
          <Button asChild size="lg" className="bg-primary text-white hover:bg-accent">
            <ScrollToTopLink href="/laser-engraving">Custom Engraving Configurator</ScrollToTopLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <ScrollToTopLink href="/contact">Get a Custom Quote</ScrollToTopLink>
          </Button>
        </div>
      </div>
    </section>
  )
}
