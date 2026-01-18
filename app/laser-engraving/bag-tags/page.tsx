import { ProductConfigurator } from "@/components/product-configurator"

export const metadata = {
  title: "Laser Engraved Bag Tags | WMB Golf Co.",
  description:
    "Custom laser engraved golf bag tags with patterns and initials. Personalise your bag tag with unique designs.",
}

export default function BagTagsPage() {
  return (
    <ProductConfigurator
      itemType="bag-tags"
      title="Laser Engraved Bag Tag"
      basePrice={25}
      image="/golf-bag-tag-leather-metal-premium-luxury-close-up.jpg"
      hasSubTabs={false}
    />
  )
}
