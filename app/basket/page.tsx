"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function BasketPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart, createShopifyCheckout, isCreatingCheckout } =
    useCart()
  const router = useRouter()

  const handleCheckout = async () => {
    const result = await createShopifyCheckout()

    if (result.checkoutUrl) {
      // Only clear local cart after we have a valid checkout URL
      clearCart()
      // Redirect to Shopify hosted checkout
      window.location.href = result.checkoutUrl
    } else {
      // Show specific error message to help debug issues
      alert(result.error || "Failed to create checkout. Please try again.")
    }
  }

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-8 text-primary">Your Basket</h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-light mb-4">Your basket is empty</h2>
              <p className="text-muted-foreground mb-8">
                Browse our collection of laser engraved golf clubs and accessories.
              </p>
              <Button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "instant" })
                  router.push("/laser-engraving")
                }}
                className="bg-primary hover:bg-accent"
              >
                Shop Now
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-6 p-4 bg-secondary/50 rounded-lg">
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded bg-secondary">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        {item.brand && <p className="text-sm text-muted-foreground mb-1">{item.brand}</p>}
                        {item.pattern && item.pattern !== "none" && (
                          <p className="text-sm text-muted-foreground">Pattern: {item.pattern}</p>
                        )}
                        {item.initials && (
                          <p className="text-sm text-muted-foreground">
                            Initials: {item.initials} {item.font && `(${item.font})`}
                          </p>
                        )}
                        <p className="text-lg font-light mt-2">{item.price}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded border flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded border flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={clearCart}
                  className="mt-6 text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear basket
                </button>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-secondary/50 rounded-lg p-6 sticky top-24">
                  <h2 className="text-lg font-medium mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal (inc. shipping)</span>
                      <span>£{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>£{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-6">
                    Shipping is included in each item price. You'll complete payment securely via Shopify.
                  </p>

                  <Button
                    className="w-full bg-primary hover:bg-accent"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isCreatingCheckout}
                  >
                    {isCreatingCheckout ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Checkout...
                      </>
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </Button>

                  <Link
                    href="/laser-engraving"
                    className="block text-center text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
                    onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
