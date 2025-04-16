// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { ChevronLeft, Heart, Minus, Plus, Share2, Star, Truck } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useCart } from "@/context/cart-context"
// import { useWishlist } from "@/context/wishlist-context"
// import { products } from "@/data/products"
// import { toast } from "@/hooks/use-toast"
// import { useParams, useRouter } from "next/navigation"
// import { cn } from "@/lib/utils"

// export default function ProductPage() {
//   const params = useParams()
//   const router = useRouter()
//   const { addToCart } = useCart()
//   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
//   const [quantity, setQuantity] = useState(1)
//   const [selectedColor, setSelectedColor] = useState("black")
//   const [selectedSize, setSelectedSize] = useState("m")

//   const productId = Number(params.id)
//   const product = products.all.find((p) => p.id === productId)
//   const inWishlist = product ? isInWishlist(product.id) : false

//   if (!product) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen p-4">
//         <h1 className="text-2xl font-bold mb-4">Product not found</h1>
//         <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
//         <Button onClick={() => router.push("/")}>Return to Home</Button>
//       </div>
//     )
//   }

//   const handleAddToCart = () => {
//     addToCart(
//       {
//         ...product,
//         color: selectedColor,
//         size: selectedSize,
//       },
//       quantity,
//     )

//     toast({
//       title: "Added to cart",
//       description: `${product.name} has been added to your cart.`,
//     })
//   }

//   const handleWishlistToggle = () => {
//     if (inWishlist) {
//       removeFromWishlist(product.id)
//       toast({
//         title: "Removed from wishlist",
//         description: `${product.name} has been removed from your wishlist.`,
//       })
//     } else {
//       addToWishlist(product)
//       toast({
//         title: "Added to wishlist",
//         description: `${product.name} has been added to your wishlist.`,
//       })
//     }
//   }

//   const incrementQuantity = () => setQuantity((prev) => prev + 1)
//   const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

//   // Related products (just show some bestsellers)
//   const relatedProducts = products.bestsellers.filter((p) => p.id !== productId).slice(0, 4)

//   return (
//     <div className="min-h-screen bg-[#f8f5f2] pt-20">
//       <div className="container px-4 py-8 mx-auto">
//         <Link href="/" className="inline-flex items-center text-sm font-medium mb-8 hover:underline">
//           <ChevronLeft className="mr-1 h-4 w-4" />
//           Back to shopping
//         </Link>

//         <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
//           {/* Product Images */}
//           <div className="space-y-4">
//             <div className="aspect-square bg-white rounded-lg overflow-hidden">
//               <Image
//                 src={product.image || "/placeholder.svg"}
//                 alt={product.name}
//                 width={600}
//                 height={600}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="grid grid-cols-4 gap-4">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="aspect-square bg-white rounded-lg overflow-hidden cursor-pointer">
//                   <Image
//                     src={product.image || "/placeholder.svg"}
//                     alt={`${product.name} view ${i + 1}`}
//                     width={150}
//                     height={150}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Product Details */}
//           <div className="space-y-6">
//             <div>
//               <h1 className="text-3xl font-bold">{product.name}</h1>
//               <div className="flex items-center mt-2 mb-4">
//                 <div className="flex">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`h-5 w-5 ${i < 4 ? "fill-[#d4af37] text-[#d4af37]" : "fill-muted text-muted-foreground"}`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-muted-foreground ml-2">4.2 (24 reviews)</span>
//               </div>
//               <p className="text-3xl font-bold">${product.price}</p>
//             </div>

//             <p className="text-muted-foreground">{product.description}</p>

//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-medium mb-3">Color</h3>
//                 <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex gap-3">
//                   <div className="flex items-center">
//                     <RadioGroupItem value="black" id="black" className="peer sr-only" />
//                     <Label
//                       htmlFor="black"
//                       className="h-8 w-8 rounded-full bg-black border-2 peer-data-[state=checked]:border-primary cursor-pointer"
//                     />
//                   </div>
//                   <div className="flex items-center">
//                     <RadioGroupItem value="white" id="white" className="peer sr-only" />
//                     <Label
//                       htmlFor="white"
//                       className="h-8 w-8 rounded-full bg-white border-2 peer-data-[state=checked]:border-primary cursor-pointer"
//                     />
//                   </div>
//                   <div className="flex items-center">
//                     <RadioGroupItem value="beige" id="beige" className="peer sr-only" />
//                     <Label
//                       htmlFor="beige"
//                       className="h-8 w-8 rounded-full bg-[#e8dcca] border-2 peer-data-[state=checked]:border-primary cursor-pointer"
//                     />
//                   </div>
//                 </RadioGroup>
//               </div>

//               <div>
//                 <h3 className="font-medium mb-3">Size</h3>
//                 <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-3">
//                   {["xs", "s", "m", "l", "xl"].map((size) => (
//                     <div key={size} className="flex items-center">
//                       <RadioGroupItem value={size} id={size} className="peer sr-only" />
//                       <Label
//                         htmlFor={size}
//                         className="h-10 w-10 flex items-center justify-center rounded-md border-2 uppercase peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer"
//                       >
//                         {size}
//                       </Label>
//                     </div>
//                   ))}
//                 </RadioGroup>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="flex items-center border rounded-md">
//                   <Button variant="ghost" size="icon" className="rounded-none h-10 w-10" onClick={decrementQuantity}>
//                     <Minus className="h-4 w-4" />
//                   </Button>
//                   <span className="w-10 text-center">{quantity}</span>
//                   <Button variant="ghost" size="icon" className="rounded-none h-10 w-10" onClick={incrementQuantity}>
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>

//                 <Button className="flex-1 bg-black hover:bg-black/90 text-white rounded-none" onClick={handleAddToCart}>
//                   Add to Cart
//                 </Button>

//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className={cn("rounded-full", inWishlist && "bg-primary text-primary-foreground border-primary")}
//                   onClick={handleWishlistToggle}
//                 >
//                   <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
//                 </Button>

//                 <Button variant="outline" size="icon" className="rounded-full">
//                   <Share2 className="h-5 w-5" />
//                 </Button>
//               </div>
//             </div>

//             <div className="border-t pt-6">
//               <div className="flex items-center gap-2 text-sm">
//                 <Truck className="h-5 w-5" />
//                 <span>Free shipping on orders over $100</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Product Tabs */}
//         <div className="mt-16">
//           <Tabs defaultValue="description">
//             <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
//               {["description", "details", "reviews"].map((tab) => (
//                 <TabsTrigger
//                   key={tab}
//                   value={tab}
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 capitalize"
//                 >
//                   {tab}
//                 </TabsTrigger>
//               ))}
//             </TabsList>
//             <TabsContent value="description" className="pt-6">
//               <div className="prose max-w-none">
//                 <p>{product.description}</p>
//                 <p>
//                   Our commitment to quality is evident in every stitch. This piece is crafted using traditional
//                   techniques combined with modern technology to ensure durability and comfort. The premium materials are
//                   sourced responsibly, aligning with our sustainability goals.
//                 </p>
//                 <p>
//                   The versatile design makes it easy to dress up or down, depending on the occasion. Pair it with other
//                   pieces from our collection for a coordinated look, or mix it with your existing wardrobe for a fresh
//                   style statement.
//                 </p>
//               </div>
//             </TabsContent>
//             <TabsContent value="details" className="pt-6">
//               <div className="grid gap-4">
//                 <div className="grid grid-cols-2 gap-4 border-b pb-4">
//                   <div className="font-medium">Material</div>
//                   <div>Premium blend of natural fibers</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 border-b pb-4">
//                   <div className="font-medium">Care Instructions</div>
//                   <div>Dry clean only</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 border-b pb-4">
//                   <div className="font-medium">Origin</div>
//                   <div>Made in Italy</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 border-b pb-4">
//                   <div className="font-medium">Style</div>
//                   <div>Contemporary classic</div>
//                 </div>
//               </div>
//             </TabsContent>
//             <TabsContent value="reviews" className="pt-6">
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-medium">Customer Reviews (24)</h3>
//                   <Button>Write a Review</Button>
//                 </div>

//                 <div className="space-y-6">
//                   {[1, 2, 3].map((i) => (
//                     <div key={i} className="border-b pb-6">
//                       <div className="flex justify-between mb-2">
//                         <div className="font-medium">Sarah J.</div>
//                         <div className="text-sm text-muted-foreground">3 weeks ago</div>
//                       </div>
//                       <div className="flex mb-2">
//                         {[...Array(5)].map((_, j) => (
//                           <Star
//                             key={j}
//                             className={`h-4 w-4 ${j < 4 ? "fill-[#d4af37] text-[#d4af37]" : "fill-muted text-muted-foreground"}`}
//                           />
//                         ))}
//                       </div>
//                       <p className="text-sm">
//                         Absolutely love this piece! The quality is exceptional and it fits perfectly. I've received so
//                         many compliments when wearing it. Definitely worth the investment.
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>

//         {/* Related Products */}
//         <div className="mt-16">
//           <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {relatedProducts.map((product) => (
//               <Link href={`/product/${product.id}`} key={product.id} className="group">
//                 <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden mb-3">
//                   <Image
//                     src={product.image || "/placeholder.svg"}
//                     alt={product.name}
//                     width={300}
//                     height={400}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                   />
//                 </div>
//                 <h3 className="font-medium">{product.name}</h3>
//                 <p className="text-[#9a8a78]">${product.price}</p>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Star, Heart, Share2, Truck, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { toast } from "@/hooks/use-toast";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("m");

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          console.error("Failed to fetch product");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => router.push("/")}>Return to Home</Button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart({ ...product, color: selectedColor, size: selectedSize }, quantity);
    toast({ title: "Added to cart", description: `${product.name} added to your cart.` });
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from wishlist", description: `${product.name} removed.` });
    } else {
      addToWishlist(product);
      toast({ title: "Added to wishlist", description: `${product.name} added.` });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] pt-20">
      <div className="container px-4 py-8 mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium mb-8 hover:underline">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to shopping
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <Image
                src={product.images?.[0] ? `http://localhost:5000${product.images[0]}` : "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < 4 ? "fill-[#d4af37] text-[#d4af37]" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground ml-2">4.2 (24 reviews)</span>
            </div>
            <p className="text-3xl font-bold">${product.price}</p>
            <p className="text-muted-foreground">{product.description}</p>

            <div className="space-y-4">
              {/* Color and Size Options */}
              <div>
                <h3 className="font-medium mb-3">Color</h3>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex gap-3">
                  <Label htmlFor="black" className="h-8 w-8 bg-black rounded-full cursor-pointer border" />
                  <Label htmlFor="white" className="h-8 w-8 bg-white border rounded-full cursor-pointer" />
                  <Label htmlFor="beige" className="h-8 w-8 bg-[#e8dcca] border rounded-full cursor-pointer" />
                </RadioGroup>
              </div>

              <div>
                <h3 className="font-medium mb-3">Size</h3>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex gap-3">
                  {["xs", "s", "m", "l", "xl"].map((size) => (
                    <Label key={size} className="border p-2 uppercase cursor-pointer">{size}</Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus />
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <Plus />
                  </Button>
                </div>

                <Button className="flex-1 bg-black hover:bg-black/90 text-white" onClick={handleAddToCart}>
                  Add to Cart
                </Button>

                <Button variant="outline" size="icon" onClick={handleWishlistToggle}>
                  <Heart className={inWishlist ? "fill-current text-red-500" : ""} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 />
                </Button>
              </div>
            </div>

            <div className="border-t pt-6 text-sm flex items-center gap-2">
              <Truck /> Free shipping on orders over $100
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full border-b">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <p>{product.description}</p>
            </TabsContent>

            <TabsContent value="details" className="pt-6">Material: Premium Cotton</TabsContent>
            <TabsContent value="reviews" className="pt-6">Customer reviews coming soon...</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
