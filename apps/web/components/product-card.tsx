"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/context/cart-context";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "bestseller";
}

export default function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  if (variant === "bestseller") {
    return (
      <div
        className="group relative overflow-hidden transition-all duration-300 hover:translate-y-[-8px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${product.id}`}>
          <div className="aspect-[3/4] overflow-hidden bg-[#2a2a2a]">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={400}
              height={500}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Link>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "rounded-full backdrop-blur-sm h-9 w-9 border-white/20",
              inWishlist ? "bg-primary text-primary-foreground" : "bg-black/50"
            )}
            onClick={handleWishlistToggle}
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
          </Button>
        </div>
        <div className="mt-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium">{product.name}</h3>
          </Link>
          <div className="flex justify-between items-center mt-1">
            <p className="text-[#9a8a78]">${product.price}</p>
            <Button
              size="sm"
              className="bg-white text-black hover:bg-white/90 rounded-none px-3 py-1 text-xs animate-bounce-subtle"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* <Link href={`/product/${product.id}`}>
        <div className="aspect-[3/4] overflow-hidden bg-[#f0ece6]">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={500}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </Link> */}

      <Link href={`/product/${product.id}`}>
        <div className="aspect-[3/4] overflow-hidden bg-[#f0ece6] relative">
          {product.images?.length ? (
            <Image
              src={`http://localhost:5000${product.images[0]}`}
              alt="Product Image"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
              No Image
            </div>
          )}
        </div>
      </Link>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="outline"
          className={cn(
            "rounded-full bg-white/80 backdrop-blur-sm h-9 w-9",
            inWishlist && "bg-primary text-primary-foreground border-primary"
          )}
          onClick={handleWishlistToggle}
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
        </Button>
      </div>
      <div className="mt-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-[#9a8a78] mt-1">${product.price}</p>
        </Link>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer"
        onClick={handleAddToCart}
      >
        Add to Cart
      </div>
    </div>
  );
}
