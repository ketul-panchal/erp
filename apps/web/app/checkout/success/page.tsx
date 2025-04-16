"use client"

import Link from "next/link"
import { CheckCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function CheckoutSuccessPage() {
  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`

  return (
    <div className="min-h-screen bg-[#f8f5f2] pt-20">
      <div className="container px-4 py-16 mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-muted-foreground mb-8">
            Your order has been received and is now being processed. We'll send you a confirmation email shortly.
          </p>

          <div className="bg-[#f8f5f2] rounded-lg p-6 mb-8">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Order Number:</span>
              <span>{orderNumber}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment Method:</span>
              <span>Credit Card</span>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex items-center justify-center mb-8">
            <Package className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Your order will be shipped within 1-2 business days</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-black hover:bg-black/90 text-white rounded-none">
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-none">
              <Link href="/profile">View Order History</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

