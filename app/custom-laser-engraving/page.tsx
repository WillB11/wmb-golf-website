import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollToTopLink } from "@/components/scroll-to-top-link"

const engravingOptions = [
  {
    name: "Wedges & Irons",
    description: "Precision engraving on wedge and iron faces",
    image: "/custom-laser-engraved-golf-wedge-close-up.jpg",
  },
  {
    name: "Putters",
    description: "Custom putter engravings and personalisation",
    image: "/laser-engraved-golf-putter.jpg",
  },
  {
    name: "Ball Markers & Divot Tools",
    description: "Personalised accessories for the course",
    image: "/laser-engraved-golf-ball-markers-and-divot-tools-a.jpg",
  },
  {
    name: "Bag Tags",
    description: "Custom engraved bag tags and labels",
    image: "/laser-engraved-golf-bag-tag.jpg",
  },
]

const steps = [
  {
    number: "01",
    title: "Submit a Quote",
    description:
      "Send us photos of your clubs, graphics/logos you want, and describe the layout, orientation, and paint colours",
  },
  {
    number: "02",
    title: "Receive Your Quote",
    description: "We'll review your request and provide you with a detailed quote",
  },
  {
    number: "03",
    title: "Send Your Clubs",
    description: "Post or drop off your clubs to our UK workshop",
  },
  {
    number: "04",
    title: "Design Mockups",
    description: "We'll send over design mockups for your approval before any work begins",
  },
  {
    number: "05",
    title: "Engraving",
    description: "Upon approval, we'll precision engrave your designs",
  },
  {
    number: "06",
    title: "Invoice & Return",
    description: "Once complete, we'll send an invoice to pay before shipping back or notifying you for pickup",
  },
]

const faqs = [
  {
    question: "How long does custom laser engraving take?",
    answer: "Typical turnaround is 7-10 working days from design approval. Rush services are available upon request.",
  },
  {
    question: "Can you engrave any golf club brand?",
    answer: "Yes, we can laser engrave most major brands including Titleist, Callaway, TaylorMade, Ping, and more.",
  },
  {
    question: "What file formats do you accept for custom designs?",
    answer: "We accept PNG, JPG, SVG, and PDF files. Vector files (SVG) provide the best results for complex designs.",
  },
  {
    question: "Do you offer paint fill services?",
    answer:
      "Yes, we offer professional paint fill and detailing to enhance your engraved designs with various colour options.",
  },
]

export default function CustomEngravingPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-primary flex items-center justify-center">
          <div className="absolute inset-0">
            <img
              src="/laser-engraving-golf-club-workshop.jpg"
              alt="Custom laser engraving for golf clubs"
              className="h-full w-full object-cover opacity-20"
            />
          </div>
          <div className="relative z-10 text-center px-6">
            <h1 className="text-4xl md:text-5xl font-light tracking-wide text-white mb-4 text-balance">
              What Can We Engrave?
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed text-balance">
              Personalised laser engraving on wedges, irons, putters, and golf accessories
            </p>
            <Button asChild size="lg" className="mt-6 bg-white text-primary hover:bg-white/90">
              <ScrollToTopLink href="/contact">Get a Quote</ScrollToTopLink>
            </Button>
          </div>
        </section>

        {/* Description */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-light tracking-wide mb-6 text-balance">Precision Laser Engraving Process</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our laser engraving service uses advanced technology to create permanent, high-quality engravings on golf
              clubs and accessories. Whether you want a personal message, custom artwork, or a unique design, we deliver
              clean, repeatable results with exceptional precision.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every custom laser engraved golf club is finished to the highest standard, ensuring durability and visual
              impact on the course.
            </p>
          </div>
        </section>

        {/* What Can Be Engraved */}
        <section className="py-16 px-6 bg-secondary">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-light tracking-wide mb-6 text-center">What Can Be Engraved</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12 leading-relaxed">
              From initials and names to club logos, images of family, pets, football club badges, and almost anything
              you can imagine. If you can picture it, we can engrave it.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {engravingOptions.map((option) => (
                <Card key={option.name} className="overflow-hidden border-0">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={option.image || "/placeholder.svg"}
                      alt={option.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-medium mb-2">{option.name}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-light tracking-wide mb-12 text-center">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="text-4xl font-light text-primary mb-4">{step.number}</div>
                  <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 px-6 bg-secondary">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-light tracking-wide mb-8">Pricing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Due to the nature of custom work, prices can vary from job to job. Typically, prices start at around{" "}
              <span className="font-medium text-foreground">£50</span> depending on factors such as design complexity,
              paint fill requirements, and setup time.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you would like a design we have already done, or a simple pattern across your club, it can work out
              cheaper. It's best to contact us for a quote to find out!
            </p>
          </div>
        </section>

        <section id="enquiry" className="py-24 px-6">
          <div className="container mx-auto text-center">
            <h2 className="mb-6 text-3xl font-light tracking-wide md:text-4xl text-balance">Get a Quote</h2>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance">
              Ready to personalise your golf clubs? Get in touch to discuss your custom laser engraving project.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button asChild size="lg" className="bg-primary text-white hover:bg-accent">
                <ScrollToTopLink href="/contact">Get a Quote</ScrollToTopLink>
              </Button>
              <Button asChild size="lg" variant="outline">
                <ScrollToTopLink href="/laser-engraved-golf-clubs-for-sale">Browse Engraved Clubs</ScrollToTopLink>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 bg-secondary">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-light tracking-wide mb-12 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
