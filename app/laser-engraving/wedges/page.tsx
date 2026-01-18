import { ProductConfigurator } from "@/components/product-configurator"

export const metadata = {
  title: "Laser Engraved Wedges | WMB Golf Co.",
  description:
    "Custom laser engraved golf wedges with patterns and initials. Personalise your wedges with hexagonal, zig zag, or damascus patterns.",
}

export default function WedgesPage() {
  return (
    <ProductConfigurator
      itemType="wedges"
      title="Laser Engraved Wedge"
      basePrice={50}
      image="/golf-wedge-club-head-silver-metal-close-up.jpg"
      hasSubTabs={true}
    />
  )
}
