import { ProductConfigurator } from "@/components/product-configurator"

export const metadata = {
  title: "Laser Engraved Ball Markers | WMB Golf Co.",
  description:
    "Custom laser engraved golf ball markers with patterns and initials. Personalise your ball markers with unique designs.",
}

export default function BallMarkersPage() {
  return (
    <ProductConfigurator
      itemType="ball-markers"
      title="Laser Engraved Ball Marker"
      basePrice={15}
      image="/golf-ball-marker-metal-coin-silver-brass-close-up.jpg"
      hasSubTabs={false}
    />
  )
}
