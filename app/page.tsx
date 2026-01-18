import { Header } from "@/components/header"
import { HeroVideo } from "@/components/hero-video"
import { ServicesTiles } from "@/components/services-tiles"
import { WhyWMB } from "@/components/why-wmb"
import { Gallery } from "@/components/gallery"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroVideo />
        <ServicesTiles />
        <WhyWMB />
        <Gallery />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
