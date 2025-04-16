"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Heart, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useWishlist } from "@/context/wishlist-context"
import { useCart } from "@/context/cart-context"
import { toast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const handleAddToCart = (productId: number) => {
    const product = wishlistItems.find((item) => item.id === productId)
    if (product) {
      addToCart(product)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    }
  }

  const handleAddSelectedToCart = () => {
    selectedItems.forEach((id) => {
      const product = wishlistItems.find((item) => item.id === id)
      if (product) {
        addToCart(product)
      }
    })

    toast({
      title: "Items added to cart",
      description: `${selectedItems.length} items have been added to your cart.`,
    })

    setSelectedItems([])
  }

  const toggleSelectItem = (productId: number) => {
    setSelectedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const selectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(wishlistItems.map((item) => item.id))
    }
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] pt-20">
        <div className="container px-4 py-16 mx-auto max-w-4xl">
          <div className="flex flex-col items-center justify-center text-center py-16">
            <Heart className="h-16 w-16 mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              You haven't added any items to your wishlist yet. Browse our collection to find something you'll love.
            </p>
            <Button asChild size="lg" className="bg-black hover:bg-black/90 text-white rounded-none">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] pt-20">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <Link href="/" className="inline-flex items-center text-sm font-medium hover:underline">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="select-all"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedItems.length === wishlistItems.length && wishlistItems.length > 0}
                  onChange={selectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Select All ({wishlistItems.length} items)
                </label>
              </div>

              <div className="flex gap-4">
                {selectedItems.length > 0 && (
                  <Button variant="outline" size="sm" className="rounded-none" onClick={handleAddSelectedToCart}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add Selected to Cart
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={clearWishlist}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Wishlist
                </Button>
              </div>
            </div>

            <Separator className="mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="border rounded-md overflow-hidden group">
                  <div className="flex items-start p-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                    />

                    <div className="ml-4 flex-1">
                      <div className="flex gap-4">
                        <div className="w-20 h-24 bg-[#f0ece6] rounded-md overflow-hidden flex-shrink-0">
                          <Link href={`/product/${item.id}`}>
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={80}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          </Link>
                        </div>

                        <div className="flex-1">
                          <Link href={`/product/${item.id}`} className="font-medium hover:underline">
                            {item.name}
                          </Link>
                          <p className="text-[#9a8a78] mt-1">${item.price}</p>

                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              className="bg-black hover:bg-black/90 text-white rounded-none text-xs h-8"
                              onClick={() => handleAddToCart(item.id)}
                            >
                              <ShoppingBag className="h-3 w-3 mr-1" />
                              Add to Cart
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-none text-xs h-8 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={() => removeFromWishlist(item.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

