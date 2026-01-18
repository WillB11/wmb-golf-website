import { Check } from "lucide-react"

const features = [
  "Precision laser engraving technology",
  "Clean, repeatable results every time",
  "Attention to detail in every project",
  "Built for golfers who care about quality",
  "Designed and finished with accuracy in mind",
]

export function WhyWMB() {
  return (
    <section className="bg-primary py-24 px-6 text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-3xl font-light tracking-wide md:text-4xl text-balance">Why WMB Golf Co.</h2>
        <p className="mb-12 text-lg text-white/90 leading-relaxed text-balance">
          We specialise in custom laser engraved golf clubs with an engineering-led approach. Every club and accessory
          is finished to the highest standard, ensuring precision and durability.
        </p>
        <div className="grid gap-4 text-left sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <Check className="mt-1 h-5 w-5 flex-shrink-0" />
              <span className="text-sm leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
