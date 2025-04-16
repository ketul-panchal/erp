"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { toast } from "@/hooks/use-toast";
import {
  products,
  categories,
  testimonials,
  socialIcons,
} from "@/data/products";
import type { Product } from "@/types";

export default function FashionHomepage() {
  const API_BASE_URL = "http://localhost:5000";

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeProductSlide, setActiveProductSlide] = useState(0);

  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const featuredRef = useRef<HTMLDivElement>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`);
        }
        const data: Product[] = await response.json();

        // If your backend does not filter by "featured", do it here:
        // const featured = data.filter((p) => p.isFeatured === true);
        // setFeaturedProducts(featured);

        setFeaturedProducts(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProductSlide(
        (prev) => (prev + 1) % Math.ceil(featuredProducts.length / 4)
      );
    }, 7000);

    return () => clearInterval(interval);
  }, [featuredProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategoriesData(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroSection = document.querySelector(".hero-section");
      const heroContent = document.querySelector(".hero-content");
      const parallaxElements = document.querySelectorAll(".parallax");

      if (heroSection && heroContent) {
        heroContent.setAttribute(
          "style",
          `transform: translateY(${scrollY * 0.4}px)`
        );
      }

      parallaxElements.forEach((el, index) => {
        const speed = 0.1 * (index + 1);
        el.setAttribute("style", `transform: translateY(${scrollY * speed}px)`);
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollFeatured = (direction: "left" | "right") => {
    if (!featuredRef.current || featuredProducts.length === 0) return;

    const newIndex =
      direction === "left" ? activeProductSlide - 1 : activeProductSlide + 1;

    const maxIndex = Math.ceil(featuredProducts.length / 4) - 1;
    if (newIndex < 0) {
      setActiveProductSlide(maxIndex);
    } else if (newIndex > maxIndex) {
      setActiveProductSlide(0);
    } else {
      setActiveProductSlide(newIndex);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] overflow-x-hidden pt-16">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden hero-section">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Fashion hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in hero-content">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
            Timeless Elegance, Modern Style
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of premium fashion pieces designed
            for the modern connoisseur
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-white/90 transition-all duration-300 text-lg px-8 py-6 rounded-none"
          >
            Explore Collection
          </Button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white opacity-70" />
        </div>
      </section>

      {/* Featured Products Carousel */}
      {/* <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto animate-on-scroll parallax">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Featured Collection</h2>
        <div className="relative">
          <div ref={featuredRef} className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeProductSlide * 100}%)` }}
            >
              {products.featured.map((product, index) => (
                <div key={index} className="min-w-[50%] md:min-w-[33.333%] lg:min-w-[25%] px-3">
                  <div className="group relative overflow-hidden">
                    <Link href={`/product/${product.id}`}>
                      <div className="aspect-[3/4] overflow-hidden bg-[#f0ece6]">
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
                        className="rounded-full bg-white/80 backdrop-blur-sm h-9 w-9"
                      >
                        <Heart className="h-4 w-4" />
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
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md z-10"
            onClick={() => scrollFeatured("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md z-10"
            onClick={() => scrollFeatured("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(products.featured.length / 4) }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  activeProductSlide === index ? "bg-black w-6" : "bg-gray-300",
                )}
                onClick={() => setActiveProductSlide(index)}
              />
            ))}
          </div>
        </div>
      </section> */}

      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Featured Collection
        </h2>

        <div className="relative">
          <div ref={featuredRef} className="overflow-hidden">
            {/* Carousel inner container */}
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${activeProductSlide * 100}%)`,
              }}
            >
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="min-w-[50%] md:min-w-[33.333%] lg:min-w-[25%] px-3"
                >
                  {/* <div className="group relative overflow-hidden">
                    <Link href={`/product/${product.id}`}>
                      <div className="aspect-[3/4] overflow-hidden bg-[#f0ece6]">
                      {product.images?.length ? (
                      <Image
                        src={`http://localhost:5000${product.images[0]}`}
                        // width={300}
                        // height={700}
                        fill
                        className="w-full h-full object-cover"
                        alt="Product Image"
                        // unoptimized
                      />
                    ) : (
                      "No Image"
                    )}
                      </div>
                    </Link>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full bg-white/80 backdrop-blur-sm h-9 w-9"
                      >
                        <Heart className="h-4 w-4" />
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
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </div>
                  </div> */}
                  <div className="group relative flex flex-col overflow-hidden h-full">
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

                    {/* Product name & price */}
                    <div className="mt-4">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-[#9a8a78] mt-1">${product.price}</p>
                      </Link>
                    </div>

                    {/* Optional: Add to Cart button */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Left and Right buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md z-10"
            onClick={() => scrollFeatured("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md z-10"
            onClick={() => scrollFeatured("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Slide indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({
              length: Math.ceil(featuredProducts.length / 4 || 1),
            }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  activeProductSlide === index ? "bg-black w-6" : "bg-gray-300"
                )}
                onClick={() => setActiveProductSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      {/* <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto animate-on-scroll parallax">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              href={`/category/${category.slug}`}
              key={index}
              className="group relative overflow-hidden aspect-square"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-medium">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section> */}
      
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto animate-on-scroll parallax">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesData.map((category, index) => (
            <Link
              href={`/category/${category.id}`}
              key={index}
              className="group relative overflow-hidden aspect-square rounded-lg shadow-md"
            >
              <Image
                src={
                  `http://localhost:5000${category.image}` || "/placeholder.svg"
                }
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-medium">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-20 px-4 md:px-8 bg-[#1a1a1a] text-white animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Bestsellers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.bestsellers.map((product, index) => (
              <div
                key={index}
                className="group relative overflow-hidden transition-all duration-300 hover:translate-y-[-8px]"
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
                    className="rounded-full bg-black/50 backdrop-blur-sm h-9 w-9 border-white/20"
                  >
                    <Heart className="h-4 w-4" />
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
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto animate-on-scroll parallax">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          What Our Customers Say
        </h2>
        <div
          ref={testimonialsRef}
          className="relative max-w-3xl mx-auto overflow-hidden"
        >
          <div className="relative h-[300px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-1000",
                  activeTestimonial === index
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                )}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-[#d4af37] text-[#d4af37]"
                    />
                  ))}
                </div>
                <p className="text-lg italic mb-6 max-w-2xl">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  activeTestimonial === index ? "bg-black w-6" : "bg-gray-300"
                )}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4 md:px-8 bg-[#f0ece6] animate-on-scroll">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-lg shadow-lg border border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-[#9a8a78]/10 z-0"></div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
                Join Our Newsletter
              </h2>
              <p className="text-center mb-8 text-gray-600">
                Subscribe to receive updates on new arrivals, special offers and
                exclusive events.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Your email address"
                  className="flex-1 bg-transparent border-[#9a8a78] focus:border-[#d4af37] transition-all duration-300 rounded-none"
                />
                <Button className="bg-black hover:bg-black/90 text-white rounded-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">LUXE</h3>
            <p className="text-gray-400 mb-6">
              Premium fashion for the modern connoisseur. Timeless elegance with
              contemporary style.
            </p>
            <div className="flex gap-4">
              {socialIcons.map((icon, index) => (
                <Link
                  href="#"
                  key={index}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Shop</h4>
            <ul className="space-y-2">
              {[
                "New Arrivals",
                "Bestsellers",
                "Women",
                "Men",
                "Accessories",
                "Sale",
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Help</h4>
            <ul className="space-y-2">
              {[
                "Customer Service",
                "Track Order",
                "Returns & Exchanges",
                "Shipping",
                "Contact Us",
                "FAQ",
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">About</h4>
            <ul className="space-y-2">
              {[
                "Our Story",
                "Sustainability",
                "Careers",
                "Press",
                "Privacy Policy",
                "Terms of Service",
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-gray-500">
          <p>© 2024 LUXE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Missing component
const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
