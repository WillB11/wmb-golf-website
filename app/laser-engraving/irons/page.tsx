import { ProductConfigurator } from "@/components/product-configurator"

export const metadata = {
  title: "Laser Engraved Irons | WMB Golf Co.",
  description:
    "Custom laser engraved golf irons with patterns and initials. Personalise your irons with hexagonal, zig zag, or damascus patterns.",
}

export default function IronsPage() {
  return (
    <ProductConfigurator
      itemType="irons"
      title="Laser Engraved Iron"
      basePrice={50}
      image="/golf-iron-club-head-silver-metal-close-up.jpg"
      hasSubTabs={true}
    />
  )
}
