// "use client"

// import type React from "react"
// import { useState } from "react"
// import Link from "next/link"
// import {
//   Box,
//   Home,
//   Package,
//   Users,
//   TruckIcon,
//   BarChart3,
//   Settings,
//   LogOut,
//   Menu,
//   Bell,
//   Search,
//   ChevronsLeft,
//   Warehouse,
// } from "lucide-react"
// import { usePathname } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarProvider,
//   SidebarRail,
// } from "@/components/ui/sidebar"

// interface DashboardLayoutProps {
//   children: React.ReactNode
// }

// const mainNavItems = [
//   { title: "Dashboard", icon: Home, href: "/dashboard" },
//   { title: "Inventory", icon: Package, href: "/dashboard/inventory" },
//   { title: "Orders", icon: Box, href: "/dashboard/orders" },
//   { title: "Shipments", icon: TruckIcon, href: "/dashboard/shipments" },
//   { title: "Customers", icon: Users, href: "/dashboard/customers" },
//   { title: "Reports", icon: BarChart3, href: "/dashboard/reports" },
//   { title: "Settings", icon: Settings, href: "/dashboard/settings" },
// ]

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const pathname = usePathname()
//   const [mobileOpen, setMobileOpen] = useState(false)

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen bg-background w-full">
//         {/* Sidebar for desktop */}
//         <Sidebar className="hidden lg:flex w-[250px]">
//           <SidebarHeader className="flex h-14 items-center justify-center border-b px-4">
//             <Link href="/dashboard" className="flex items-center space-x-2 text-primary font-semibold">
//               <Warehouse className="h-6 w-6" />
//               <span className="text-xl">WarehouseERP</span>
//             </Link>
//           </SidebarHeader>
//           <SidebarContent>
//             <SidebarMenu>
//               {mainNavItems.map((item) => (
//                 <SidebarMenuItem key={item.href}>
//                   <SidebarMenuButton asChild isActive={pathname === item.href}>
//                     <Link href={item.href}>
//                       <item.icon className="h-5 w-5" />
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarContent>
//           <SidebarFooter className="border-t p-4">
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 className="w-full justify-start text-muted-foreground"
//                 onClick={() => console.log("Logout clicked")}
//               >
//                 <LogOut className="mr-2 h-4 w-4" />
//                 Logout
//               </Button>
//             </div>
//           </SidebarFooter>
//           <SidebarRail />
//         </Sidebar>

//         {/* Mobile sidebar using Sheet */}
//         <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
//           <SheetTrigger asChild>
//             <Button variant="ghost" size="icon" className="lg:hidden">
//               <Menu className="h-5 w-5" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="p-0 w-[250px]">
//             <div className="flex h-14 items-center justify-between border-b px-4">
//               <Link
//                 href="/dashboard"
//                 className="flex items-center space-x-2 text-primary font-semibold"
//                 onClick={() => setMobileOpen(false)}
//               >
//                 <Warehouse className="h-6 w-6" />
//                 <span className="text-xl">WarehouseERP</span>
//               </Link>
//               <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(false)}>
//                 <ChevronsLeft className="h-5 w-5" />
//               </Button>
//             </div>
//             <div className="px-2 py-4">
//               <nav className="flex flex-col gap-2">
//                 {mainNavItems.map((item) => (
//                   <Button
//                     key={item.href}
//                     variant={pathname === item.href ? "default" : "ghost"}
//                     className="justify-start"
//                     asChild
//                   >
//                     <Link href={item.href} onClick={() => setMobileOpen(false)}>
//                       <item.icon className="mr-2 h-5 w-5" />
//                       {item.title}
//                     </Link>
//                   </Button>
//                 ))}
//               </nav>
//             </div>
//           </SheetContent>
//         </Sheet>

//         <div className="flex flex-1 flex-col w-full">
//           {/* Top navbar */}
//           <header className="sticky top-0 z-10 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//             <div className="flex h-14 items-center justify-between px-4 lg:px-6">
//               <div className="flex items-center gap-4">
//                 <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
//                   <Menu className="h-5 w-5" />
//                 </Button>
//                 <div className="relative w-full max-w-md hidden md:flex">
//                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input type="search" placeholder="Search..." className="pl-8 w-full md:w-[300px] lg:w-[400px]" />
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Button variant="ghost" size="icon" aria-label="Notifications">
//                   <Bell className="h-5 w-5" />
//                 </Button>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                       <Avatar className="h-8 w-8">
//                         <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
//                         <AvatarFallback>JS</AvatarFallback>
//                       </Avatar>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuLabel>John Smith</DropdownMenuLabel>
//                     <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
//                       john.smith@company.com
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem>Profile</DropdownMenuItem>
//                     <DropdownMenuItem>Settings</DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem>Logout</DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>
//           </header>

//           {/* Main content */}
//           <main className="flex-1 w-full max-w-none px-4 lg:px-6">{children}</main>
//         </div>
//       </div>
//     </SidebarProvider>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Box,
  Home,
  Package,
  Users,
  TruckIcon,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronsLeft,
  Warehouse,
  ChartBarStacked,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const mainNavItems = [
  { title: "Dashboard", icon: Home, href: "/dashboard" },
  { title: "Inventory", icon: Package, href: "/dashboard/inventory" },
  { title: "Products", icon: Package, href: "/dashboard/products" },
  { title: "POS", icon: ShoppingCart, href: "/pos" },
  { title: "categories", icon: ChartBarStacked, href: "/dashboard/categories" },
  { title: "Suppliers", icon: Users, href: "/dashboard/suppliers" },
  { title: "Customers", icon: Users, href: "/dashboard/customers" },
  { title: "Warehouses", icon: Warehouse, href: "/dashboard/warehouses" },
  { title: "Orders", icon: Box, href: "/dashboard/orders" },
  { title: "Shipments", icon: TruckIcon, href: "/dashboard/shipments" },
  { title: "Reports", icon: BarChart3, href: "/dashboard/reports" },
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; avatarUrl?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/login")
      }
    }

    fetchUser()
  }, [])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        {/* Sidebar for desktop */}
        <Sidebar className="hidden lg:flex w-[250px]">
          <SidebarHeader className="flex h-14 items-center justify-center border-b px-4">
            <Link href="/dashboard" className="flex items-center space-x-2 text-primary font-semibold">
              <Warehouse className="h-6 w-6" />
              <span className="text-xl">ERP</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground"
              onClick={() => {
                localStorage.removeItem("token")
                router.push("/login")
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <div className="flex flex-1 flex-col w-full ">
          {/* Top navbar */}
          <header className="sticky top-0 z-10 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4 lg:px-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="relative w-full max-w-md hidden md:flex">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search..." className="pl-8 w-full md:w-[300px] lg:w-[400px]" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback>
                          {user
                            ? user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user ? user.name : "Loading..."}</DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                      {user ? user.email : "Fetching user..."}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        localStorage.removeItem("token")
                        router.push("/login")
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 w-full max-w-none px-4 lg:px-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
