import { ProductConfigurator } from "@/components/product-configurator"

export const metadata = {
  title: "Laser Engraved Putters | WMB Golf Co.",
  description:
    "Custom laser engraved golf putters with patterns and initials. Personalise your putter with hexagonal, zig zag, or damascus patterns.",
}

export default function PuttersPage() {
  return (
    <ProductConfigurator
      itemType="putters"
      title="Laser Engraved Putter"
      basePrice={60}
      image="/golf-putter-head-silver-metal-mallet-style-close-u.jpg"
      hasSubTabs={false}
    />
  )
}
