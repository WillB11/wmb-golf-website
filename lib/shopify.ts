// Shopify Storefront API client
const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!

const SHOPIFY_STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`

// Map internal product types to Shopify product handles
// These must match exact product handles in your Shopify store
export const SHOPIFY_PRODUCT_HANDLES: Record<string, string> = {
  wedges: "laser-engraved-wedges",
  irons: "laser-engraved-irons", 
  putters: "laser-engraved-putters",
  "ball-markers": "laser-engraved-ball-markers",
  "divot-tools": "laser-engraved-divot-tools",
  "bag-tags": "laser-engraved-bag-tags",
}

// Map internal product types to Shopify product titles (fallback)
export const SHOPIFY_PRODUCT_TITLES: Record<string, string> = {
  wedges: "Laser Engraved Wedges",
  irons: "Laser Engraved Irons", 
  putters: "Laser Engraved Putters",
  "ball-markers": "Laser Engraved Ball Markers",
  "divot-tools": "Laser Engraved Divot Tools",
  "bag-tags": "Laser Engraved Bag Tags",
}

// Postage product titles in Shopify
export const SHOPIFY_POSTAGE_TITLES = {
  standard: "Standard Postage",
  clubReturn: "Club Return Postage",
}

// Accessory types that require standard postage
export const ACCESSORY_TYPES = ["ball-markers", "divot-tools", "bag-tags"]

// Club types that require club return postage
export const CLUB_TYPES = ["wedges", "irons", "putters"]

// Cache for variant IDs to avoid repeated API calls
const variantIdCache: Record<string, string> = {}

interface ShopifyGraphQLResponse<T> {
  data: T
  errors?: Array<{ message: string }>
}

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(SHOPIFY_STOREFRONT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  const json: ShopifyGraphQLResponse<T> = await response.json()

  if (json.errors) {
    console.error("Shopify API errors:", json.errors)
    throw new Error(json.errors[0]?.message || "Shopify API error")
  }

  return json.data
}

// Get the first variant ID for a product by handle
// Returns the variant's global ID in format: gid://shopify/ProductVariant/123456
export async function getFirstVariantId(handle: string): Promise<string | null> {
  // Check cache first
  if (variantIdCache[handle]) {
    return variantIdCache[handle]
  }

  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        variants(first: 1) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `

  try {
    const data = await shopifyFetch<{
      product: {
        id: string
        title: string
        variants: {
          edges: Array<{
            node: {
              id: string
              title: string
              price: { amount: string; currencyCode: string }
            }
          }>
        }
      } | null
    }>(query, { handle })

    if (!data.product || !data.product.variants.edges[0]) {
      return null
    }

    const variantId = data.product.variants.edges[0].node.id
    // Cache the variant ID
    variantIdCache[handle] = variantId
    return variantId
  } catch {
    return null
  }
}

// Get the first variant ID for a product by searching for its title
export async function getFirstVariantIdByTitle(title: string): Promise<string | null> {
  const cacheKey = `title:${title}`
  if (variantIdCache[cacheKey]) {
    return variantIdCache[cacheKey]
  }

  const query = `
    query searchProducts($query: String!) {
      products(first: 5, query: $query) {
        edges {
          node {
            id
            title
            handle
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  try {
    const data = await shopifyFetch<{
      products: {
        edges: Array<{
          node: {
            id: string
            title: string
            handle: string
            variants: {
              edges: Array<{
                node: {
                  id: string
                  title: string
                  price: { amount: string; currencyCode: string }
                }
              }>
            }
          }
        }>
      }
    }>(query, { query: `title:${title}` })

    // Find exact title match
    const product = data.products.edges.find(
      (edge) => edge.node.title.toLowerCase() === title.toLowerCase()
    )?.node

    if (!product || !product.variants.edges[0]) {
      return null
    }

    const variantId = product.variants.edges[0].node.id
    variantIdCache[cacheKey] = variantId
    return variantId
  } catch {
    return null
  }
}

// Legacy function for backward compatibility
export async function getProductByHandle(handle: string) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        variants(first: 1) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{
    product: {
      id: string
      title: string
      variants: {
        edges: Array<{
          node: {
            id: string
            title: string
            price: { amount: string; currencyCode: string }
          }
        }>
      }
    } | null
  }>(query, { handle })

  return data.product
}

// Create a new cart
export async function createCart() {
  const query = `
    mutation cartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const data = await shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null
      userErrors: Array<{ field: string[]; message: string }>
    }
  }>(query)

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message)
  }

  return data.cartCreate.cart
}

// Add items to cart with custom attributes
export async function addToCart(
  cartId: string,
  lines: Array<{
    merchandiseId: string
    quantity: number
    attributes: Array<{ key: string; value: string }>
  }>,
) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                attributes {
                  key
                  value
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart: {
        id: string
        checkoutUrl: string
        lines: {
          edges: Array<{
            node: {
              id: string
              quantity: number
              attributes: Array<{ key: string; value: string }>
            }
          }>
        }
      } | null
      userErrors: Array<{ field: string[]; message: string }>
    }
  }>(query, { cartId, lines })

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message)
  }

  return data.cartLinesAdd.cart
}

// Get cart checkout URL
export async function getCartCheckoutUrl(cartId: string) {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
      }
    }
  `

  const data = await shopifyFetch<{
    cart: { id: string; checkoutUrl: string } | null
  }>(query, { cartId })

  return data.cart?.checkoutUrl
}
