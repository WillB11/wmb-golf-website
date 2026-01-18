"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { products } from "@/lib/products"
import { useRouter } from "next/navigation"

export function FeaturedProducts() {
  const router = useRouter()
  const featuredProducts = products.slice(0, 4)

  const handleViewProduct = (id: number) => {
    window.scrollTo({ top: 0, behavior: "instant" })
    router.push(`/product/${id}`)
  }

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-light tracking-wide md:text-4xl">Featured Products</h2>
          <p className="text-muted-foreground leading-relaxed">Stock laser engraved golf clubs ready to ship</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewProduct(product.id)}
            >
              <div className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-sm font-medium tracking-wide">{product.name}</h3>
                <p className="mb-4 text-lg font-light">{product.price}</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
