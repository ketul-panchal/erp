"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  LogIn,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/auth-context";
import { categories } from "@/data/products";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories from API
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

  const navLinks = [
    { name: "Home", href: "/" },
    {
      name: "Categories",
      href: "#",
      dropdown: true,
      items: categoriesData.map((cat) => ({
        name: cat.name,
        href: `/category/${cat.id}`, // Assuming each category has an `id` and `name`
      })),
    },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Sale", href: "/sale" },
  ];

  return (
    // <header
    //   className={cn(
    //     "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    //     isScrolled
    //       ? "bg-white/90 backdrop-blur-md shadow-sm text-black py-3"
    //       : "bg-black/40 backdrop-blur-sm shadow-md text-white py-5",
    //   )}
    // >
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm text-black py-3"
          : "bg-black text-white py-5 "
      )}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold">
            XYZ
          </Link>
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) =>
              link.dropdown ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "text-sm font-medium hover:opacity-70 transition-opacity flex items-center",
                        pathname.includes(link.href)
                          ? "opacity-100"
                          : "opacity-80"
                      )}
                    >
                      {link.name} <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {link.items?.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            isScrolled
                              ? "text-black"
                              : "text-white"
                          )}
                        >
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium hover:opacity-70 transition-opacity",
                    pathname === link.href ? "opacity-100" : "opacity-80"
                  )}
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isSearchOpen ? (
            <div className="hidden md:flex items-center relative">
              <Input
                placeholder="Search..."
                className={cn(
                  "w-[200px] bg-transparent border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 pl-0",
                  isScrolled ? "border-black/30" : "border-white/30"
                )}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
                  {wishlistItems.length}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="py-6">
                  <h2 className="text-2xl font-bold mb-6">LUXE</h2>
                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) =>
                      link.dropdown ? (
                        <div key={link.name} className="space-y-2">
                          <div className="text-lg font-medium">{link.name}</div>
                          <div className="pl-4 space-y-2">
                            {link.items?.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="text-muted-foreground hover:text-foreground block"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={cn(
                            "text-lg font-medium hover:text-primary transition-colors",
                            pathname === link.href
                              ? "text-primary"
                              : "text-foreground"
                          )}
                        >
                          {link.name}
                        </Link>
                      )
                    )}
                  </nav>
                </div>
                <div className="mt-auto py-6 border-t">
                  <div className="flex flex-col space-y-4">
                    {user ? (
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 text-foreground hover:text-primary"
                      >
                        <User className="h-5 w-5" />
                        My Account
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className="flex items-center gap-2 text-foreground hover:text-primary"
                      >
                        <LogIn className="h-5 w-5" />
                        Login / Register
                      </Link>
                    )}
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-2 text-foreground hover:text-primary"
                    >
                      <Heart className="h-5 w-5" />
                      Wishlist ({wishlistItems.length})
                    </Link>
                    <Link
                      href="/cart"
                      className="flex items-center gap-2 text-foreground hover:text-primary"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Cart ({totalItems})
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
