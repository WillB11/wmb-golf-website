import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollToTopLink } from "@/components/scroll-to-top-link"

export default function GrooveRefurbishmentPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-accent flex items-center justify-center">
          <div className="absolute inset-0">
            <img
              src="/groove-refurbishment-laser.jpg"
              alt="Golf club groove refurbishment"
              className="h-full w-full object-cover opacity-40"
            />
          </div>
          <div className="relative z-10 text-center px-6">
            <h1 className="text-4xl md:text-5xl font-light tracking-wide text-white mb-4 text-balance">
              Golf Club Groove Refurbishment
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed text-balance">
              Restore worn grooves and bring your wedges back to peak performance
            </p>
          </div>
        </section>

        {/* Description */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-light tracking-wide mb-6">Restore Spin and Control</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Over time, golf club grooves wear down, reducing spin and control around the greens. Our groove
              refurbishment service restores your wedges to like-new condition using precision techniques.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We clean, re-cut, and finish grooves to manufacturer specifications, ensuring optimal performance and
              extending the life of your clubs.
            </p>
          </div>
        </section>

        {/* Before/After Section */}
        <section className="py-16 px-6 bg-secondary">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-light tracking-wide mb-12 text-center">Before & After</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="overflow-hidden border-0">
                <img
                  src="/worn-golf-club-grooves-before-refurbishment.jpg"
                  alt="Worn golf club grooves before refurbishment"
                  className="w-full h-80 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">Before</h3>
                  <p className="text-sm text-muted-foreground">Worn grooves with reduced spin</p>
                </div>
              </Card>
              <Card className="overflow-hidden border-0">
                <img
                  src="/restored-golf-club-grooves-after-refurbishment.jpg"
                  alt="Restored golf club grooves after refurbishment"
                  className="w-full h-80 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">After</h3>
                  <p className="text-sm text-muted-foreground">Restored grooves for optimal performance</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-light tracking-wide mb-6 text-center">Who Is This Service For?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">⛳</div>
                <h3 className="text-lg font-medium mb-2">Serious Golfers</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Players who demand maximum spin and control around the greens
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">🏌️</div>
                <h3 className="text-lg font-medium mb-2">Value Seekers</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Extend the life of your favourite wedges instead of replacing them
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-lg font-medium mb-2">Restoration Enthusiasts</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bring vintage or worn clubs back to pristine condition
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 px-6 bg-secondary">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-light tracking-wide mb-6">Pricing</h2>
            <Card className="p-12">
              <div className="text-5xl font-light mb-4">£30</div>
              <p className="text-lg text-muted-foreground mb-8">per club</p>
              <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary">✓</span>
                  <span>Complete groove cleaning and restoration</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary">✓</span>
                  <span>Club face refinishing</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary">✓</span>
                  <span>7-10 day turnaround</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary">✓</span>
                  <span>Shipping calculated at checkout</span>
                </li>
              </ul>
              <Button asChild className="bg-primary hover:bg-accent">
                <ScrollToTopLink href="/contact">Book Refurbishment</ScrollToTopLink>
              </Button>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
