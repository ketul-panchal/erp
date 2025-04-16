"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CreditCard, Heart, LogOut, Package, Settings, User, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useWishlist } from "@/context/wishlist-context"
import { useCart } from "@/context/cart-context"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { user, logout } = useAuth()
  const { wishlistItems } = useWishlist()
  const { addToCart } = useCart()

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const orders = [
    {
      id: "ORD-2345",
      date: "March 15, 2024",
      status: "Delivered",
      total: "$458.00",
      items: [{ name: "Wool Blend Overcoat", price: "$459.00", image: "/placeholder.svg?height=80&width=80" }],
    },
    {
      id: "ORD-1234",
      date: "February 28, 2024",
      status: "Processing",
      total: "$299.00",
      items: [{ name: "Silk Blend Blazer", price: "$299.00", image: "/placeholder.svg?height=80&width=80" }],
    },
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] pt-20">
        <div className="container px-4 py-16 mx-auto max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <User className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-8">Please sign in to view your profile and manage your account.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-black hover:bg-black/90 text-white rounded-none">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-none">
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] pt-20">
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          <div className="space-y-4">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                <Image
                  src={user.avatar || "/placeholder.svg?height=100&width=100"}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">Member since 2023</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <nav className="flex flex-col">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-4 hover:bg-[#f8f5f2] border-l-2 border-primary"
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 p-4 hover:bg-[#f8f5f2] border-l-2 border-transparent"
                >
                  <Heart className="h-5 w-5" />
                  Wishlist ({wishlistItems.length})
                </Link>
                <Link
                  href="/profile/orders"
                  className="flex items-center gap-3 p-4 hover:bg-[#f8f5f2] border-l-2 border-transparent"
                >
                  <Package className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="/profile/payment"
                  className="flex items-center gap-3 p-4 hover:bg-[#f8f5f2] border-l-2 border-transparent"
                >
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </Link>
                <Link
                  href="/profile/settings"
                  className="flex items-center gap-3 p-4 hover:bg-[#f8f5f2] border-l-2 border-transparent"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
                <Separator />
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 p-4 justify-start rounded-none text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Button>
              </nav>
            </div>
          </div>

          <div>
            <Tabs defaultValue="profile">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="profile"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  Profile Information
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  Order History
                </TabsTrigger>
                <TabsTrigger
                  value="wishlist"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  Wishlist
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="pt-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Personal Information</h2>
                    {!isEditing && (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit
                      </Button>
                    )}
                  </div>

                  <form onSubmit={handleSaveProfile}>
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input
                            id="first-name"
                            defaultValue={user.name.split(" ")[0]}
                            disabled={!isEditing}
                            className="rounded-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input
                            id="last-name"
                            defaultValue={user.name.split(" ")[1] || ""}
                            disabled={!isEditing}
                            className="rounded-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user.email}
                          disabled={!isEditing}
                          className="rounded-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          defaultValue="(123) 456-7890"
                          disabled={!isEditing}
                          className="rounded-none"
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue="123 Main St" disabled={!isEditing} className="rounded-none" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" defaultValue="New York" disabled={!isEditing} className="rounded-none" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" defaultValue="NY" disabled={!isEditing} className="rounded-none" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input id="zip" defaultValue="10001" disabled={!isEditing} className="rounded-none" />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex justify-end gap-4">
                          <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-black hover:bg-black/90 text-white rounded-none">
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="pt-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Order History</h2>

                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-[#f8f5f2] p-4 flex flex-wrap justify-between gap-4">
                          <div>
                            <div className="font-medium">Order {order.id}</div>
                            <div className="text-sm text-muted-foreground">{order.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{order.total}</div>
                            <div
                              className={`text-sm ${order.status === "Delivered" ? "text-green-600" : "text-amber-600"}`}
                            >
                              {order.status}
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="w-16 h-16 bg-[#f0ece6] rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <p className="font-medium">{item.name}</p>
                                  <p>{item.price}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t p-4 flex justify-end">
                          <Button variant="outline" size="sm" className="rounded-none">
                            View Order Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="wishlist" className="pt-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">My Wishlist</h2>

                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                      <p className="text-muted-foreground mb-6">Items added to your wishlist will appear here</p>
                      <Button asChild className="bg-black hover:bg-black/90 text-white rounded-none">
                        <Link href="/">Browse Products</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="flex gap-4 border rounded-md p-4">
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
                                onClick={() => {
                                  addToCart(item)
                                  toast({
                                    title: "Added to cart",
                                    description: `${item.name} has been added to your cart.`,
                                  })
                                }}
                              >
                                <ShoppingBag className="h-3 w-3 mr-1" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

