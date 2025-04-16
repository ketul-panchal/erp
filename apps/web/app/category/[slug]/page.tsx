// "use client"

// import { useState, useEffect } from "react"
// import { useParams } from "next/navigation"
// import Image from "next/image"
// import Link from "next/link"
// import { ChevronDown, ChevronUp, Filter, Grid3X3, Heart, List, SlidersHorizontal, Star } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Slider } from "@/components/ui/slider"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { products, categories } from "@/data/products"
// import { useWishlist } from "@/context/wishlist-context"
// import { useCart } from "@/context/cart-context"
// import { toast } from "@/hooks/use-toast"
// import { cn } from "@/lib/utils"
// import ProductCard from "@/components/product-card"
// import type { Product } from "@/types"

// // Price range for filters
// const MIN_PRICE = 50
// const MAX_PRICE = 500

// export default function CategoryPage() {
//   const params = useParams()
//   const slug = params.slug as string
//   const category = categories.find((c) => c.slug === slug)

//   // State for filters and sorting
//   const [view, setView] = useState<"grid" | "list">("grid")
//   const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE])
//   const [selectedColors, setSelectedColors] = useState<string[]>([])
//   const [selectedSizes, setSelectedSizes] = useState<string[]>([])
//   const [selectedRating, setSelectedRating] = useState<number | null>(null)
//   const [sortBy, setSortBy] = useState<string>("featured")
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
//   const [expandedFilters, setExpandedFilters] = useState({
//     price: true,
//     color: true,
//     size: true,
//     rating: true,
//   })
//   useEffect(() => {
//     let filtered = [...products.all]

//     filtered = filtered.filter((product) => {
//       const price = Number.parseFloat(product.price)
//       return price >= priceRange[0] && price <= priceRange[1]
//     })

//     if (selectedColors.length > 0) {
//       filtered = filtered.filter((product) => selectedColors.includes(product.color || "black"))
//     }

//     // Filter by size
//     if (selectedSizes.length > 0) {
//       filtered = filtered.filter((product) => selectedSizes.includes(product.size || "m"))
//     }

//     // Filter by rating
//     if (selectedRating) {
//       filtered = filtered.filter((product) => {
//         // In a real app, you would have actual ratings
//         // For demo, we'll use a random rating based on product id
//         const rating = (product.id % 5) + 1
//         return rating >= selectedRating
//       })
//     }

//     // Sort products
//     switch (sortBy) {
//       case "price-low-high":
//         filtered.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
//         break
//       case "price-high-low":
//         filtered.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
//         break
//       case "newest":
//         filtered.sort((a, b) => {
//           // In a real app, you would sort by date
//           // For demo, we'll sort by id (higher id = newer)
//           return b.id - a.id
//         })
//         break
//       case "rating":
//         filtered.sort((a, b) => {
//           // In a real app, you would sort by actual ratings
//           // For demo, we'll use a random rating based on product id
//           return (b.id % 5) + 1 - ((a.id % 5) + 1)
//         })
//         break
//       default: // featured
//         // Keep original order
//         break
//     }

//     setFilteredProducts(filtered)
//   }, [priceRange, selectedColors, selectedSizes, selectedRating, sortBy])

//   const toggleFilter = (filter: keyof typeof expandedFilters) => {
//     setExpandedFilters((prev) => ({
//       ...prev,
//       [filter]: !prev[filter],
//     }))
//   }

//   const handleColorToggle = (color: string) => {
//     setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
//   }

//   const handleSizeToggle = (size: string) => {
//     setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
//   }

//   const clearFilters = () => {
//     setPriceRange([MIN_PRICE, MAX_PRICE])
//     setSelectedColors([])
//     setSelectedSizes([])
//     setSelectedRating(null)
//   }

//   const availableColors = ["black", "white", "beige", "blue", "green", "red"]
//   const availableSizes = ["xs", "s", "m", "l", "xl"]

//   // Filter sidebar component
//   const FilterSidebar = () => (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h3 className="font-medium text-lg">Filters</h3>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={clearFilters}
//           className="h-8 text-xs text-muted-foreground hover:text-foreground"
//         >
//           Clear All
//         </Button>
//       </div>

//       <Separator />

//       {/* Price Range Filter */}
//       <div>
//         <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilter("price")}>
//           <h4 className="font-medium">Price Range</h4>
//           {expandedFilters.price ? (
//             <ChevronUp className="h-4 w-4 text-muted-foreground" />
//           ) : (
//             <ChevronDown className="h-4 w-4 text-muted-foreground" />
//           )}
//         </div>

//         {expandedFilters.price && (
//           <div className="mt-4 space-y-4">
//             <Slider
//               defaultValue={[MIN_PRICE, MAX_PRICE]}
//               min={MIN_PRICE}
//               max={MAX_PRICE}
//               step={10}
//               value={priceRange}
//               onValueChange={(value) => setPriceRange(value as [number, number])}
//               className="py-4"
//             />
//             <div className="flex items-center justify-between">
//               <div className="border rounded-md px-3 py-1 text-sm">${priceRange[0]}</div>
//               <div className="border rounded-md px-3 py-1 text-sm">${priceRange[1]}</div>
//             </div>
//           </div>
//         )}
//       </div>

//       <Separator />

//       {/* Color Filter */}
//       <div>
//         <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilter("color")}>
//           <h4 className="font-medium">Color</h4>
//           {expandedFilters.color ? (
//             <ChevronUp className="h-4 w-4 text-muted-foreground" />
//           ) : (
//             <ChevronDown className="h-4 w-4 text-muted-foreground" />
//           )}
//         </div>

//         {expandedFilters.color && (
//           <div className="mt-4 grid grid-cols-3 gap-2">
//             {availableColors.map((color) => (
//               <div key={color} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`color-${color}`}
//                   checked={selectedColors.includes(color)}
//                   onCheckedChange={() => handleColorToggle(color)}
//                 />
//                 <Label htmlFor={`color-${color}`} className="flex items-center text-sm capitalize cursor-pointer">
//                   <div
//                     className="h-4 w-4 rounded-full mr-2 border"
//                     style={{
//                       backgroundColor: color === "beige" ? "#e8dcca" : color,
//                       borderColor: color === "white" ? "#ddd" : "transparent",
//                     }}
//                   />
//                   {color}
//                 </Label>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <Separator />

//       {/* Size Filter */}
//       <div>
//         <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilter("size")}>
//           <h4 className="font-medium">Size</h4>
//           {expandedFilters.size ? (
//             <ChevronUp className="h-4 w-4 text-muted-foreground" />
//           ) : (
//             <ChevronDown className="h-4 w-4 text-muted-foreground" />
//           )}
//         </div>

//         {expandedFilters.size && (
//           <div className="mt-4 flex flex-wrap gap-2">
//             {availableSizes.map((size) => (
//               <div
//                 key={size}
//                 className={cn(
//                   "h-9 w-9 flex items-center justify-center rounded-md border-2 uppercase cursor-pointer",
//                   selectedSizes.includes(size)
//                     ? "border-primary bg-primary/5"
//                     : "border-border hover:border-muted-foreground",
//                 )}
//                 onClick={() => handleSizeToggle(size)}
//               >
//                 {size}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <Separator />

//       {/* Rating Filter */}
//       <div>
//         <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilter("rating")}>
//           <h4 className="font-medium">Rating</h4>
//           {expandedFilters.rating ? (
//             <ChevronUp className="h-4 w-4 text-muted-foreground" />
//           ) : (
//             <ChevronDown className="h-4 w-4 text-muted-foreground" />
//           )}
//         </div>

//         {expandedFilters.rating && (
//           <div className="mt-4 space-y-2">
//             <RadioGroup
//               value={selectedRating?.toString() || ""}
//               onValueChange={(value) => setSelectedRating(value ? Number.parseInt(value) : null)}
//             >
//               {[4, 3, 2, 1].map((rating) => (
//                 <div key={rating} className="flex items-center space-x-2">
//                   <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
//                   <Label htmlFor={`rating-${rating}`} className="flex items-center cursor-pointer">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={cn(
//                             "h-4 w-4",
//                             i < rating ? "fill-[#d4af37] text-[#d4af37]" : "fill-muted text-muted-foreground",
//                           )}
//                         />
//                       ))}
//                     </div>
//                     <span className="ml-2 text-sm">& Up</span>
//                   </Label>
//                 </div>
//               ))}
//             </RadioGroup>
//           </div>
//         )}
//       </div>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-[#f8f5f2] pt-20">
//       <div className="container px-4 py-8 mx-auto">
//         {/* Breadcrumb */}
//         <div className="flex items-center text-sm mb-6">
//           <Link href="/" className="text-muted-foreground hover:text-foreground">
//             Home
//           </Link>
//           <span className="mx-2 text-muted-foreground">/</span>
//           <span className="font-medium">{category?.name || "All Products"}</span>
//         </div>

//         {/* Category Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold">{category?.name || "All Products"}</h1>
//             <p className="text-muted-foreground mt-1">{filteredProducts.length} products</p>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* Mobile Filter Button */}
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="outline" size="sm" className="md:hidden">
//                   <Filter className="h-4 w-4 mr-2" />
//                   Filters
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
//                 <FilterSidebar />
//               </SheetContent>
//             </Sheet>

//             {/* Sort Dropdown */}
//             <div className="flex items-center gap-2">
//               <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
//               <Select value={sortBy} onValueChange={setSortBy}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="featured">Featured</SelectItem>
//                   <SelectItem value="price-low-high">Price: Low to High</SelectItem>
//                   <SelectItem value="price-high-low">Price: High to Low</SelectItem>
//                   <SelectItem value="newest">Newest First</SelectItem>
//                   <SelectItem value="rating">Highest Rated</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* View Toggle */}
//             <div className="hidden md:flex border rounded-md">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className={cn("rounded-none h-9 w-9", view === "grid" && "bg-muted")}
//                 onClick={() => setView("grid")}
//               >
//                 <Grid3X3 className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className={cn("rounded-none h-9 w-9", view === "list" && "bg-muted")}
//                 onClick={() => setView("list")}
//               >
//                 <List className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row gap-8">
//           {/* Desktop Filter Sidebar */}
//           <div className="hidden md:block w-64 flex-shrink-0">
//             <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
//               <FilterSidebar />
//             </div>
//           </div>

//           {/* Product Grid */}
//           <div className="flex-1">
//             {filteredProducts.length === 0 ? (
//               <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//                 <Image
//                   src="/placeholder.svg?height=120&width=120"
//                   alt="No products found"
//                   width={120}
//                   height={120}
//                   className="mx-auto mb-6"
//                 />
//                 <h3 className="text-xl font-medium mb-2">No products found</h3>
//                 <p className="text-muted-foreground mb-6">
//                   Try adjusting your filters to find what you're looking for.
//                 </p>
//                 <Button onClick={clearFilters}>Clear All Filters</Button>
//               </div>
//             ) : view === "grid" ? (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {filteredProducts.map((product) => (
//                   <ProductCard key={product.id} product={product} />
//                 ))}
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {filteredProducts.map((product) => (
//                   <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
//                     <div className="flex flex-col sm:flex-row">
//                       <div className="sm:w-48 h-48 bg-[#f0ece6]">
//                         <Link href={`/product/${product.id}`}>
//                           <Image
//                             src={product.image || "/placeholder.svg"}
//                             alt={product.name}
//                             width={200}
//                             height={200}
//                             className="w-full h-full object-cover"
//                           />
//                         </Link>
//                       </div>
//                       <div className="p-6 flex-1">
//                         <Link href={`/product/${product.id}`}>
//                           <h3 className="font-medium text-lg hover:underline">{product.name}</h3>
//                         </Link>
//                         <div className="flex mt-1 mb-2">
//                           {[...Array(5)].map((_, i) => (
//                             <Star
//                               key={i}
//                               className={cn(
//                                 "h-4 w-4",
//                                 i < (product.id % 5) + 1
//                                   ? "fill-[#d4af37] text-[#d4af37]"
//                                   : "fill-muted text-muted-foreground",
//                               )}
//                             />
//                           ))}
//                           <span className="text-sm text-muted-foreground ml-2">
//                             ({Math.floor(Math.random() * 50) + 5})
//                           </span>
//                         </div>
//                         <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
//                           {product.description || "No description available."}
//                         </p>
//                         <div className="flex items-center justify-between">
//                           <p className="text-xl font-bold">${product.price}</p>
//                           <div className="flex gap-2">
//                             <ListItemActions product={product} />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Pagination */}
//             <div className="mt-12 flex justify-center">
//               <div className="flex">
//                 <Button variant="outline" size="icon" className="rounded-r-none">
//                   <ChevronUp className="h-4 w-4 rotate-90" />
//                 </Button>
//                 <Button variant="outline" className="rounded-none bg-primary text-primary-foreground">
//                   1
//                 </Button>
//                 <Button variant="outline" className="rounded-none">
//                   2
//                 </Button>
//                 <Button variant="outline" className="rounded-none">
//                   3
//                 </Button>
//                 <Button variant="outline" size="icon" className="rounded-l-none">
//                   <ChevronDown className="h-4 w-4 rotate-90" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Component for list view actions
// function ListItemActions({ product }: { product: Product }) {
//   const { addToCart } = useCart()
//   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
//   const inWishlist = isInWishlist(product.id)

//   const handleAddToCart = () => {
//     addToCart(product)
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

//   return (
//     <>
//       <Button size="sm" className="bg-black hover:bg-black/90 text-white rounded-none" onClick={handleAddToCart}>
//         Add to Cart
//       </Button>
//       <Button
//         variant="outline"
//         size="icon"
//         className={cn("rounded-full h-9 w-9", inWishlist && "bg-primary text-primary-foreground border-primary")}
//         onClick={handleWishlistToggle}
//       >
//         <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
//       </Button>
//     </>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Grid3X3,
  Heart,
  List,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/product-card";
import type { Product } from "@/types";

const MIN_PRICE = 50;
const MAX_PRICE = 500;

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  // State for category and products
  const [category, setCategory] = useState<any | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // State for filters and sorting
  const [view, setView] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    MIN_PRICE,
    MAX_PRICE,
  ]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    color: true,
    size: true,
    rating: true,
  });

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        const token = localStorage.getItem("token");
        const categoryRes = await fetch(
          `http://localhost:5000/api/categories/${slug}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const categoryData = await categoryRes.json();
        setCategory(categoryData);

        // Fetch products by category
        const productsRes = await fetch(
          `http://localhost:5000/api/products?categoryId=${categoryData.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const productsData = await productsRes.json();
        console.log("Fetched Products:", productsData); // Add logging to check the response
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error fetching category or products:", error);
      }
    }
    fetchCategoryData();
  }, [slug]);

  // Filter products based on selected filters
  useEffect(() => {
    let filtered = [...products];

    // Filter by price range
    // filtered = filtered.filter((product) => {
    //   const price = Number.parseFloat(product.price)
    //   return price >= priceRange[0] && price <= priceRange[1]
    // })

    // // Filter by selected colors
    // if (selectedColors.length > 0) {
    //   filtered = filtered.filter((product) => selectedColors.includes(product.color || "black"))
    // }

    // // Filter by selected sizes
    // if (selectedSizes.length > 0) {
    //   filtered = filtered.filter((product) => selectedSizes.includes(product.size || "m"))
    // }

    // // Filter by rating
    // if (selectedRating) {
    //   filtered = filtered.filter((product) => {
    //     // In a real app, you would use actual ratings. Here, we assume a random rating for demo.
    //     const rating = (product.id % 5) + 1
    //     return rating >= selectedRating
    //   })
    // }

    // // Sort products
    // switch (sortBy) {
    //   case "price-low-high":
    //     filtered.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
    //     break
    //   case "price-high-low":
    //     filtered.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
    //     break
    //   case "newest":
    //     filtered.sort((a, b) => {
    //       return b.id - a.id // Sort by ID for demo purposes
    //     })
    //     break
    //   case "rating":
    //     filtered.sort((a, b) => {
    //       // In a real app, you would sort by actual ratings.
    //       return (b.id % 5) + 1 - ((a.id % 5) + 1)
    //     })
    //     break
    //   default:
    //     break
    // }

    setFilteredProducts(filtered);
  }, [
    products,
    priceRange,
    selectedColors,
    selectedSizes,
    selectedRating,
    sortBy,
  ]);

  const toggleFilter = (filter: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedRating(null);
  };

  const availableColors = ["black", "white", "beige", "blue", "green", "red"];
  const availableSizes = ["xs", "s", "m", "l", "xl"];

  // Filter sidebar component
  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          Clear All
        </Button>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleFilter("price")}
        >
          <h4 className="font-medium">Price Range</h4>
          {expandedFilters.price ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        {expandedFilters.price && (
          <div className="mt-4 space-y-4">
            <Slider
              defaultValue={[MIN_PRICE, MAX_PRICE]}
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={10}
              value={priceRange}
              onValueChange={(value) =>
                setPriceRange(value as [number, number])
              }
              className="py-4"
            />
            <div className="flex items-center justify-between">
              <div className="border rounded-md px-3 py-1 text-sm">
                ${priceRange[0]}
              </div>
              <div className="border rounded-md px-3 py-1 text-sm">
                ${priceRange[1]}
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Color Filter */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleFilter("color")}
        >
          <h4 className="font-medium">Color</h4>
          {expandedFilters.color ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        {expandedFilters.color && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {availableColors.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={selectedColors.includes(color)}
                  onCheckedChange={() => handleColorToggle(color)}
                />
                <Label
                  htmlFor={`color-${color}`}
                  className="flex items-center text-sm capitalize cursor-pointer"
                >
                  <div
                    className="h-4 w-4 rounded-full mr-2 border"
                    style={{
                      backgroundColor: color === "beige" ? "#e8dcca" : color,
                      borderColor: color === "white" ? "#ddd" : "transparent",
                    }}
                  />
                  {color}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Size Filter */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleFilter("size")}
        >
          <h4 className="font-medium">Size</h4>
          {expandedFilters.size ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        {expandedFilters.size && (
          <div className="mt-4 flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <div
                key={size}
                className={cn(
                  "h-9 w-9 flex items-center justify-center rounded-md border-2 uppercase cursor-pointer",
                  selectedSizes.includes(size)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground"
                )}
                onClick={() => handleSizeToggle(size)}
              >
                {size}
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Rating Filter */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleFilter("rating")}
        >
          <h4 className="font-medium">Rating</h4>
          {expandedFilters.rating ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        {expandedFilters.rating && (
          <div className="mt-4 space-y-2">
            <RadioGroup
              value={selectedRating?.toString() || ""}
              onValueChange={(value) =>
                setSelectedRating(value ? Number.parseInt(value) : null)
              }
            >
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={rating.toString()}
                    id={`rating-${rating}`}
                  />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="flex items-center cursor-pointer"
                  >
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < rating
                              ? "fill-[#d4af37] text-[#d4af37]"
                              : "fill-muted text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">& Up</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f5f2] pt-20">
      <div className="container px-4 py-8 mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="font-medium">
            {category?.name || "All Products"}
          </span>
        </div>

        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {category?.name || "All Products"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} products
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[350px] overflow-y-auto"
              >
                <FilterSidebar />
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low-high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-high-low">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-none h-9 w-9",
                  view === "grid" && "bg-muted"
                )}
                onClick={() => setView("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-none h-9 w-9",
                  view === "list" && "bg-muted"
                )}
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <FilterSidebar />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Image
                  src="/placeholder.svg?height=120&width=120"
                  alt="No products found"
                  width={120}
                  height={120}
                  className="mx-auto mb-6"
                />
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-48 bg-[#f0ece6]">
                        {/* <Link href={`/product/${product.id}`}>
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </Link> */}
                        <div className="sm:w-48 h-48 bg-[#f0ece6]">
                          <Link href={`/product/${product.id}`}>
                            <div className="aspect-[3/4] overflow-hidden bg-[#f0ece6] relative">
                              {product.images?.length ? (
                                <Image
                                  src={`http://localhost:5000${product.images[0]}`} // Use the first image from the product images array
                                  alt={`${product.name} Image`}
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
                        </div>
                      </div>
                      <div className="p-6 flex-1">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-medium text-lg hover:underline">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex mt-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < (product.id % 5) + 1
                                  ? "fill-[#d4af37] text-[#d4af37]"
                                  : "fill-muted text-muted-foreground"
                              )}
                            />
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">
                            ({Math.floor(Math.random() * 50) + 5})
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {product.description || "No description available."}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold">${product.price}</p>
                          <div className="flex gap-2">
                            <ListItemActions product={product} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-r-none"
                >
                  <ChevronUp className="h-4 w-4 rotate-90" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-none bg-primary text-primary-foreground"
                >
                  1
                </Button>
                <Button variant="outline" className="rounded-none">
                  2
                </Button>
                <Button variant="outline" className="rounded-none">
                  3
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-l-none"
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for list view actions
function ListItemActions({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
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

  return (
    <>
      <Button
        size="sm"
        className="bg-black hover:bg-black/90 text-white rounded-none"
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "rounded-full h-9 w-9",
          inWishlist && "bg-primary text-primary-foreground border-primary"
        )}
        onClick={handleWishlistToggle}
      >
        <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
      </Button>
    </>
  );
}
