"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: string
  priceNumber: number
  image: string
  quantity: number
  brand?: string
  design?: string
  pattern?: string
  initials?: string
  font?: string
  nameText?: string
  nameFont?: string
  configurationType?: "patterns" | "illustrations"
  itemType?: string
  notes?: string
}

interface CheckoutResult {
  checkoutUrl: string | null
  error: string | null
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  createShopifyCheckout: () => Promise<CheckoutResult>
  isCreatingCheckout: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("wmb-cart")
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("wmb-cart", JSON.stringify(items))
  }, [items])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.priceNumber * i.quantity, 0)

  const createShopifyCheckout = async (): Promise<CheckoutResult> => {
    if (items.length === 0) {
      return { checkoutUrl: null, error: "Your basket is empty." }
    }

    setIsCreatingCheckout(true)
    try {
      const response = await fetch("/api/shopify/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { checkoutUrl: null, error: data.error || "Failed to create checkout. Please try again." }
      }

      return { checkoutUrl: data.checkoutUrl, error: null }
    } catch (error) {
      return {
        checkoutUrl: null,
        error: error instanceof Error ? error.message : "Failed to create checkout. Please try again.",
      }
    } finally {
      setIsCreatingCheckout(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        createShopifyCheckout,
        isCreatingCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
