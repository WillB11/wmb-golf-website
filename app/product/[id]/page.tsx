"use client"

import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getProductById } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { ArrowLeft, Check } from "lucide-react"
import { useState } from "react"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const productId = Number(params.id)
  const product = getProductById(productId)

  if (!product) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-light mb-4">Product not found</h1>
            <Button onClick={() => router.push("/laser-engraved-golf-clubs-for-sale")}>Back to Shop</Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNumber: product.priceNumber,
      image: product.image,
      brand: product.brand,
      design: product.design,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-6 py-12">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "instant" })
              router.push("/laser-engraved-golf-clubs-for-sale")
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </button>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square overflow-hidden bg-secondary rounded-lg">
              <img
                src={product.image || "/placeholder.svg"}
                alt={`${product.name} - laser engraved golf club`}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="text-sm text-muted-foreground mb-2">{product.brand}</div>
              <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-4">{product.name}</h1>
              <div className="text-sm text-muted-foreground mb-4">{product.design}</div>
              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
              <div className="text-3xl font-light mb-8">{product.price}</div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className={`flex-1 ${added ? "bg-green-600 hover:bg-green-600" : "bg-primary hover:bg-accent"}`}
                  onClick={handleAddToCart}
                >
                  {added ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Added to Basket
                    </>
                  ) : (
                    "Add to Basket"
                  )}
                </Button>
              </div>

              <div className="mt-12 pt-8 border-t">
                <h3 className="text-sm font-medium mb-4">Product Details</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Category: {product.category}</li>
                  <li>Brand: {product.brand}</li>
                  <li>Engraving Style: {product.design}</li>
                  <li>Free UK shipping on orders over £100</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
