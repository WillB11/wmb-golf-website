import { NextResponse } from "next/server"
import {
  createCart,
  addToCart,
  getFirstVariantId,
  getFirstVariantIdByTitle,
  SHOPIFY_PRODUCT_HANDLES,
  SHOPIFY_PRODUCT_TITLES,
  SHOPIFY_POSTAGE_TITLES,
  ACCESSORY_TYPES,
  CLUB_TYPES,
} from "@/lib/shopify"

export async function POST(request: Request) {
  try {
    const { items } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Create a new Shopify cart using Cart API
    const cart = await createCart()
    if (!cart) {
      return NextResponse.json({ error: "Failed to create Shopify cart. Please try again." }, { status: 500 })
    }

    // Prepare line items - fetch all variant IDs first
    const lines: Array<{
      merchandiseId: string
      quantity: number
      attributes: Array<{ key: string; value: string }>
    }> = []

    const failedItems: string[] = []

    // Track which postage types are needed
    let needsStandardPostage = false
    let needsClubReturnPostage = false

    for (const item of items) {
      const productType = item.itemType || "wedges"
      const handle = SHOPIFY_PRODUCT_HANDLES[productType]
      const title = SHOPIFY_PRODUCT_TITLES[productType]

      if (!handle && !title) {
        failedItems.push(`Unknown product type: ${productType}`)
        continue
      }

      // Try to get variant ID by handle first, then by title as fallback
      let variantId = handle ? await getFirstVariantId(handle) : null

      // If handle lookup failed, try title lookup (especially for Bag Tags)
      if (!variantId && title) {
        variantId = await getFirstVariantIdByTitle(title)
      }

      if (!variantId) {
        failedItems.push(
          `Shopify product not found: "${title || handle}". Please ensure the product exists in your Shopify store.`
        )
        continue
      }

      // Track which postage type this item requires
      if (ACCESSORY_TYPES.includes(productType)) {
        needsStandardPostage = true
      }
      if (CLUB_TYPES.includes(productType)) {
        needsClubReturnPostage = true
      }

      // Build attributes for the line item (order details visible in Shopify admin)
      const attributes: Array<{ key: string; value: string }> = [
        { key: "Product Type", value: productType },
        { key: "Item Name", value: item.name || "Custom Engraving" },
      ]

      // Include calculated price (Shopify products should be £0.00, this is for reference)
      if (item.priceNumber) {
        attributes.push({ key: "_price", value: item.priceNumber.toFixed(2) })
      }

      // Add configuration details
      if (item.pattern && item.pattern !== "none") {
        attributes.push({ key: "Pattern", value: item.pattern })
      }

      if (item.initials) {
        attributes.push({ key: "Initials", value: item.initials })
      }

      if (item.font) {
        attributes.push({ key: "Font", value: item.font })
      }

      if (item.nameText) {
        attributes.push({ key: "Name Text", value: item.nameText })
      }

      if (item.configurationType) {
        attributes.push({ key: "Configuration", value: item.configurationType })
      }

      // Customer notes
      if (item.notes) {
        attributes.push({ key: "Notes", value: item.notes })
      }

      // Logo file reference
      if (item.logoFile) {
        attributes.push({ key: "Logo File", value: item.logoFile })
      }

      lines.push({
        merchandiseId: variantId,
        quantity: item.quantity || 1,
        attributes,
      })
    }

    if (lines.length === 0) {
      const errorMessage =
        failedItems.length > 0
          ? `Unable to checkout: ${failedItems.join("; ")}`
          : "No valid items to add. Please check that products exist in Shopify."
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    // Add postage products (exactly one of each type if needed)
    if (needsStandardPostage) {
      const standardPostageVariantId = await getFirstVariantIdByTitle(SHOPIFY_POSTAGE_TITLES.standard)
      if (standardPostageVariantId) {
        lines.push({
          merchandiseId: standardPostageVariantId,
          quantity: 1,
          attributes: [{ key: "Type", value: "Standard Postage" }],
        })
      } else {
        failedItems.push(
          `Postage product not found: "${SHOPIFY_POSTAGE_TITLES.standard}". Please ensure this product exists in Shopify.`
        )
      }
    }

    if (needsClubReturnPostage) {
      const clubReturnPostageVariantId = await getFirstVariantIdByTitle(SHOPIFY_POSTAGE_TITLES.clubReturn)
      if (clubReturnPostageVariantId) {
        lines.push({
          merchandiseId: clubReturnPostageVariantId,
          quantity: 1,
          attributes: [{ key: "Type", value: "Club Return Postage" }],
        })
      } else {
        failedItems.push(
          `Postage product not found: "${SHOPIFY_POSTAGE_TITLES.clubReturn}". Please ensure this product exists in Shopify.`
        )
      }
    }

    // Check if postage products are missing
    if (failedItems.length > 0 && lines.length === 0) {
      return NextResponse.json({ error: `Unable to checkout: ${failedItems.join("; ")}` }, { status: 400 })
    }

    // Add items to cart using cartLinesAdd
    const updatedCart = await addToCart(cart.id, lines)

    if (!updatedCart) {
      return NextResponse.json({ error: "Failed to add items to cart" }, { status: 500 })
    }

    return NextResponse.json({
      checkoutUrl: updatedCart.checkoutUrl,
      cartId: updatedCart.id,
    })
  } catch (error) {
    console.error("[v0] Checkout creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout" },
      { status: 500 },
    )
  }
}
