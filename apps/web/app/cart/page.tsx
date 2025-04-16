"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } =
    useCart();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleApplyPromo = () => {
    setIsApplyingPromo(true);
    // Simulate API call
    setTimeout(() => {
      setIsApplyingPromo(false);
      setPromoCode("");
    }, 1000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] pt-20">
        <div className="container px-4 py-16 mx-auto max-w-4xl">
          <div className="flex flex-col items-center justify-center text-center py-16">
            <ShoppingBag className="h-16 w-16 mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Looks like you haven't added anything to your cart yet. Browse our
              collection to find something you'll love.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-black hover:bg-black/90 text-white rounded-none"
            >
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] pt-20">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium hover:underline"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <Separator className="hidden md:block mb-6" />

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b"
                  >
                    <div className="col-span-6 flex gap-4">
                      <div className="w-20 h-20 bg-[#f0ece6] rounded-md overflow-hidden flex-shrink-0">
                        {item.images?.length ? (
                          <Image
                            src={`http://localhost:5000${item.images[0]}`}
                            alt="Product Image"
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/product/${item.id}`}
                          className="font-medium hover:underline"
                        >
                          {item.name}
                        </Link>
                        {item.color && item.size && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.color.charAt(0).toUpperCase() +
                              item.color.slice(1)}{" "}
                            / Size {item.size.toUpperCase()}
                          </p>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-transparent p-0 h-auto mt-2 md:hidden"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex items-center md:justify-center">
                      <div className="text-sm md:text-base">${item.price}</div>
                    </div>

                    <div className="md:col-span-2 flex items-center md:justify-center">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-none h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-none h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between md:justify-end">
                      <div className="font-medium md:text-right">
                        $
                        {(
                          Number.parseFloat(item.price) * item.quantity
                        ).toFixed(2)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hidden md:inline-flex"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-[#f8f5f2] flex flex-wrap gap-4 justify-between items-center">
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button
                  asChild
                  className="bg-black hover:bg-black/90 text-white rounded-none"
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

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

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="rounded-none"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyPromo}
                    disabled={!promoCode || isApplyingPromo}
                    className="rounded-none"
                  >
                    Apply
                  </Button>
                </div>

                <Button
                  asChild
                  className="w-full bg-black hover:bg-black/90 text-white rounded-none"
                >
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
