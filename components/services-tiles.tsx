import Link from "next/link"
import { Card } from "@/components/ui/card"

const services = [
  {
    title: "Custom Laser Engraving",
    description: "Personalised laser engraving on golf clubs and accessories",
    href: "/custom-laser-engraving",
    image: "/custom-laser-engraved-golf-wedge-close-up.jpg",
  },
  {
    title: "Paint Fill & Detailing",
    description: "Colour and finishing to enhance engraved details",
    href: "/custom-laser-engraving#paint-fill",
    image: "/golf-club-paint-fill-detail-work.jpg",
  },
  {
    title: "Groove Refurbishment",
    description: "Restoring worn grooves and cleaning club faces",
    href: "/golf-groove-refurbishment",
    image: "/groove-refurbishment-laser.jpg",
  },
  {
    title: "Engraved Accessories",
    description: "Custom ball markers, divot tools and more",
    href: "/laser-engraved-golf-clubs-for-sale",
    image: "/laser-engraved-golf-ball-markers-and-divot-tools-a.jpg",
  },
]

export function ServicesTiles() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-light tracking-wide text-center mb-12">What We Offer</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className="group">
              <Card className="overflow-hidden transition-all hover:shadow-lg border-0">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 bg-secondary">
                  <h3 className="mb-2 text-lg font-medium tracking-wide">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
