const images = [
  {
    src: "/laser-engraved-golf-wedge-close-up-detail.jpg",
    alt: "laser engraved golf wedge close up",
  },
  {
    src: "/golf-club-groove-refurbishment-before-after.jpg",
    alt: "golf club refurbishment before and after",
  },
  {
    src: "/custom-laser-engraving-on-golf-club-process.jpg",
    alt: "custom laser engraving on golf club",
  },
  {
    src: "/finished-engraved-golf-clubs-collection.jpg",
    alt: "finished engraved golf clubs",
  },
  {
    src: "/laser-engraved-ball-marker-detail.jpg",
    alt: "laser engraved ball marker",
  },
  {
    src: "/golf-club-laser-engraving-precision-work.jpg",
    alt: "golf club laser engraving process",
  },
]

export function Gallery() {
  return (
    <section className="bg-secondary py-24 px-6">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-light tracking-wide md:text-4xl">Previous Work</h2>
          <p className="text-muted-foreground leading-relaxed">Precision laser engraving and refurbishment examples</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div key={index} className="aspect-square overflow-hidden bg-white">
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
