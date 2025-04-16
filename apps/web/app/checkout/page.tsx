"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Add proper type for the event parameter
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      toast({
        title: "Order placed successfully!",
        description:
          "Thank you for your purchase. Your order has been confirmed.",
      });
      router.push("/checkout/success");
    }, 2000);
  };

  if (cartItems.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] pt-20">
      <div className="container px-4 py-8 mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center text-sm font-medium mb-8 hover:underline"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to cart
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">
                    Shipping Information
                  </h2>

                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          required
                          className="rounded-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          required
                          className="rounded-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        className="rounded-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        className="rounded-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" required className="rounded-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required className="rounded-none" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" required className="rounded-none" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" required className="rounded-none" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="save-info" />
                      <Label
                        htmlFor="save-info"
                        className="text-sm font-normal"
                      >
                        Save this information for next time
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Shipping Method</h2>

                  <RadioGroup defaultValue="standard" className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="font-normal">
                          Standard Shipping (3-5 business days)
                        </Label>
                      </div>
                      <div>
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="font-normal">
                          Express Shipping (1-2 business days)
                        </Label>
                      </div>
                      <div>$15.00</div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Payment Method</h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="font-normal">
                          Credit Card
                        </Label>
                      </div>
                      <div className="flex space-x-2">
                        <Image
                          src="/placeholder.svg?height=30&width=40"
                          alt="Visa"
                          width={40}
                          height={30}
                        />
                        <Image
                          src="/placeholder.svg?height=30&width=40"
                          alt="Mastercard"
                          width={40}
                          height={30}
                        />
                        <Image
                          src="/placeholder.svg?height=30&width=40"
                          alt="Amex"
                          width={40}
                          height={30}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="font-normal">
                          PayPal
                        </Label>
                      </div>
                      <Image
                        src="/placeholder.svg?height=30&width=60"
                        alt="PayPal"
                        width={60}
                        height={30}
                      />
                    </div>
                  </RadioGroup>

                  {paymentMethod === "credit-card" && (
                    <div className="mt-6 space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            className="rounded-none pl-10"
                          />
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            className="rounded-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            className="rounded-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name-on-card">Name on Card</Label>
                        <Input id="name-on-card" className="rounded-none" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-black hover:bg-black/90 text-white rounded-none px-8"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-[#f0ece6] rounded-md overflow-hidden flex-shrink-0">
                      {item.images?.length ? (
                        <Image
                          src={`http://localhost:5000${item.images[0]}`}
                          alt="Product Image"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{item.name}</p>
                        <p>
                          $
                          {(
                            Number.parseFloat(item.price) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                        {item.color &&
                          item.size &&
                          ` • ${item.color.charAt(0).toUpperCase() + item.color.slice(1)} • Size ${item.size.toUpperCase()}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center text-sm text-muted-foreground mt-6">
                <Lock className="h-4 w-4 mr-2" />
                Secure checkout powered by Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
