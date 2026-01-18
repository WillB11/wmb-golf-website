import { ProductConfigurator } from "@/components/product-configurator"

export const metadata = {
  title: "Laser Engraved Divot Tools | WMB Golf Co.",
  description:
    "Custom laser engraved golf divot tools with patterns and initials. Personalise your divot tool with unique designs.",
}

export default function DivotToolsPage() {
  return (
    <ProductConfigurator
      itemType="divot-tools"
      title="Laser Engraved Divot Tool"
      basePrice={20}
      image="/golf-divot-repair-tool-metal-silver-premium-close-.jpg"
      hasSubTabs={false}
    />
  )
}
