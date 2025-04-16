import type { ReactNode } from "react"

// Make sure your Product type is properly defined in context/cart-context.tsx
// Then import it here
import type { Product } from "@/context/cart-context"

// Then properly type your products
export const products: {
  featured: Product[]
  bestsellers: Product[]
  all: Product[]
} = {
  featured: [
    {
      id: 1,
      name: "Silk Blend Blazer",
      price: "299.00",
      image: "/placeholder.svg?height=600&width=400",
      description:
        "Elevate your formal attire with our premium Silk Blend Blazer. Crafted with a luxurious blend of silk and wool, this blazer offers both comfort and sophistication. The tailored fit and subtle sheen make it perfect for special occasions or business meetings.",
    },
    {
      id: 2,
      name: "Cashmere Sweater",
      price: "189.00",
      image: "/placeholder.svg?height=600&width=400",
      description:
        "Experience unparalleled softness with our pure Cashmere Sweater. Made from the finest Mongolian cashmere, this sweater provides exceptional warmth without the bulk. The classic design ensures versatility, making it a staple in your winter wardrobe.",
    },
    {
      id: 3,
      name: "Tailored Wool Pants",
      price: "159.00",
      image: "/placeholder.svg?height=600&width=400",
      description:
        "Our Tailored Wool Pants combine classic elegance with modern comfort. The premium wool blend offers durability and a luxurious drape, while the tailored cut creates a sleek silhouette. Perfect for both office wear and formal events.",
    },
    {
      id: 4,
      name: "Leather Crossbody Bag",
      price: "249.00",
      image: "/placeholder.svg?height=600&width=400",
      description:
        "Crafted from full-grain Italian leather, our Crossbody Bag offers both style and functionality. The spacious interior features multiple compartments for organization, while the adjustable strap ensures comfortable wear. The timeless design makes it a versatile accessory for any outfit.",
    },
    {
      id: 5,
      name: "Merino Wool Cardigan",
      price: "179.00",
      image: "/placeholder.svg?height=600&width=400",
      description:
        "Our Merino Wool Cardigan offers exceptional warmth and breathability. The fine Merino wool provides natural temperature regulation, making it perfect for layering in any season. The classic button-front design and ribbed details create a timeless look.",
    },
    {
      id: 6,
      name: "Structured Midi Dress",
      price: "219.00",
      image: "/placeholder.svg?height=600&width=400",
      description:
        "Make a statement with our Structured Midi Dress. The architectural silhouette flatters the figure, while the premium fabric holds its shape beautifully. The midi length offers versatility, making it appropriate for both daytime and evening events.",
    },
    {
      id: 7,
      name: "Linen Blend Shirt",
      price: "129.00",
      image: "/placeholder.svg?height=600&width=400",
      description:
        "Stay cool and stylish with our Linen Blend Shirt. The natural linen blend offers exceptional breathability, while the tailored fit ensures a polished look. Perfect for warm weather or casual office days, this shirt combines comfort with effortless style.",
    },
    {
      id: 8,
      name: "Suede Ankle Boots",
      price: "279.00",
      image: "/placeholder.svg?height=600&width=400",
      description:
        "Step up your footwear game with our Suede Ankle Boots. Crafted from premium suede with a leather lining, these boots offer both comfort and durability. The sleek design and stacked heel create a versatile boot that pairs well with both casual and dressier outfits.",
    },
  ],
  bestsellers: [
    {
      id: 9,
      name: "Signature Trench Coat",
      price: "399.00",
      image: "/placeholder.svg?height=600&width=400",
      description:
        "Our iconic Signature Trench Coat is a timeless investment piece. Made from water-resistant cotton gabardine, it features classic details like shoulder epaulettes, a storm flap, and a belted waist. The versatile design transitions seamlessly from business attire to weekend wear.",
    },
    {
      id: 10,
      name: "Classic White Shirt",
      price: "119.00",
      image: "/placeholder.svg?height=600&width=400",
      description:
        "Every wardrobe needs a perfect white shirt, and ours delivers on quality and fit. Made from Egyptian cotton with a subtle sheen, this shirt features a classic collar and cuffs. The tailored fit flatters without restricting movement, making it ideal for any occasion.",
    },
    {
      id: 11,
      name: "Leather Tote Bag",
      price: "289.00",
      image: "/placeholder.svg?height=600&width=400",
      description:
        "Our Leather Tote Bag combines functionality with sophisticated style. Crafted from full-grain leather that develops a beautiful patina over time, this spacious tote features a secure top zip, interior pockets, and sturdy handles. Perfect for work, travel, or everyday use.",
    },
    {
      id: 12,
      name: "Wool Blend Overcoat",
      price: "459.00",
      image: "/placeholder.svg?height=600&width=400",
      description:
        "Make a refined statement with our Wool Blend Overcoat. The premium wool blend provides exceptional warmth, while the classic silhouette offers timeless appeal. Details like the notched lapel and flap pockets add a touch of sophistication to this winter essential.",
    },
  ],
  all: [], // This will be populated below
}

// Combine all products into the 'all' array
products.all = [...products.featured, ...products.bestsellers]

export const categories = [
  { name: "Women's Collection", slug: "women", image: "/placeholder.svg?height=600&width=600" },
  { name: "Men's Collection", slug: "men", image: "/placeholder.svg?height=600&width=600" },
  { name: "Accessories", slug: "accessories", image: "/placeholder.svg?height=600&width=600" },
]

export const testimonials = [
  {
    name: "Sophia Anderson",
    location: "New York, USA",
    text: "The quality of their clothing is exceptional. I've been a loyal customer for years and have never been disappointed. Their attention to detail and commitment to sustainable fashion sets them apart.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "James Wilson",
    location: "London, UK",
    text: "I recently purchased a suit for my wedding and the experience was fantastic. The staff was incredibly helpful and the tailoring service ensured a perfect fit. Highly recommend!",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Emma Thompson",
    location: "Paris, France",
    text: "Their seasonal collections are always on trend yet timeless. The pieces I've bought have become staples in my wardrobe and the quality means they last for years. Worth every penny.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export const socialIcons: ReactNode[] = [
  <svg
    key="facebook"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>,
  <svg
    key="instagram"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>,
  <svg
    key="twitter"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>,
  <svg
    key="pinterest"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 12h8"></path>
    <path d="M12 8v8"></path>
    <circle cx="12" cy="12" r="10"></circle>
  </svg>,
]

