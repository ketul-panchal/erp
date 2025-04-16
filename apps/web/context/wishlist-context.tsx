"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/context/cart-context"

type WishlistContextType = {
  wishlistItems: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = (product: Product) => {
    setWishlistItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        return prevItems
      }

      return [...prevItems, product]
    })
  }

  const removeFromWishlist = (productId: number) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

