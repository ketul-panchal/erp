"use client";

import { useState } from "react";
import { io } from "socket.io-client";
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  DollarSign,
  Smartphone,
  User,
  Package,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  AlertTriangle,
  Printer,
  Mail,
  Home,
  Users,
  Clock,
  CheckCircle,
  X,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef } from "react";
import CustomerForm from "../dashboard/customers/customer-form";

export default function POSSystem() {
  // State management
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showInvoice, setShowInvoice] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [activeNav, setActiveNav] = useState("pos");
  const [categories, setCategories] = useState<any[]>([
    { id: "all", name: "All Products" },
  ]);
  const [customerKey, setCustomerKey] = useState(0);

  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatarUrl?: string;
  } | null>(null);
  const [todaySales, setTodaySales] = useState({ count: 0, revenue: 0 });

  const [paymentStatus, setPaymentStatus] = useState("PENDING");

  const [orderSummary, setOrderSummary] = useState<any>(null);
  const printRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCustomers();
    fetchUser();
    fetchSalesData();

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    // Listen for real-time updates
    socket.on("salesUpdate", (data: any) => {
      console.log("Received salesUpdate:", data);
      setTodaySales({
        count: data.totalOrders,
        revenue: data.totalRevenue,
      });
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
    }
  };

  const fetchSalesData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch("http://localhost:5000/api/sales/today", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setTodaySales({
        count: data.totalOrders || 0,
        revenue: data.totalRevenue || 0,
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();

        const formattedProducts = data.map((product: any) => ({
          ...product,
          category: product.category.id || product.category._id,
        }));

        setProducts(formattedProducts);
      } else {
        toast.error("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products.");
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();

        const formattedCategories = data.map((cat: any) => ({
          id: cat.id || cat._id,
          name: cat.name,
        }));

        setCategories([
          { id: "all", name: "All Products" },
          ...formattedCategories,
        ]);
      } else {
        toast.error("Failed to fetch categories.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories.");
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();

        const formattedCustomers = data.map((customer: any) => ({
          id: customer.id || customer._id, // Support both "id" & "_id"
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          loyaltyPoints: customer.loyaltyPoints || 0,
          creditBalance: customer.creditBalance || 0,
        }));

        setCustomers(formattedCustomers);
      } else {
        toast.error("Failed to fetch customers.");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Error fetching customers.");
    }
  };

  // Filter products based on search and category
  // const filteredProducts = products.filter((product) => {
  //   const matchesSearch = product.name
  //     .toLowerCase()
  //     .includes(searchQuery.toLowerCase());

  //   const matchesCategory =
  //     activeTab === "all" || product.category === activeTab;

  //   return matchesSearch && matchesCategory;
  // });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchQuery)) // If barcode exists
      : true;

    const matchesCategory =
      activeTab === "all" || product.category === activeTab;

    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any) => {
    const productId = product.id || product._id; // Support both "id" & "_id"

    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: productId,
          name: product.name,
          price: parseFloat(product.price), // Ensure price is a number
          stock: product.stock,
          image: product.images[0]
            ? `http://localhost:5000${product.images[0]}`
            : "/placeholder.svg",
          quantity: 1,
        },
      ]);
    }

    toast.success(`${product.name} added to cart!`);
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Update quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (discount / 100) * subtotal;
  const taxRate = 0.08; // 8% tax
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + taxAmount;

  // const handleCheckout = async () => {
  //   if (cart.length === 0) {
  //     toast.error("Cart is empty. Please add items.");
  //     return;
  //   }

  //   if (!selectedCustomer) {
  //     toast.error("Please select a customer.");
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       router.push("/login");
  //       return;
  //     }

  //     const orderData = {
  //       customerId: selectedCustomer.id,
  //       items: cart.map((item) => ({
  //         productId: item.id,
  //         quantity: item.quantity,
  //         price: item.price,
  //       })),
  //       totalAmount: total.toFixed(2),
  //       paymentMethod,
  //     };

  //     const response = await fetch("http://localhost:5000/api/orders", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(orderData),
  //     });

  //     if (response.ok) {
  //       const savedOrder = await response.json();
  //       toast.success("Order placed successfully!");

  //       setOrderSummary({
  //         customer: selectedCustomer,
  //         cart: [...cart],
  //         total,
  //         orderId: savedOrder.orderNumber,
  //         orderDate: new Date().toLocaleString(),
  //       });

  //       setCart([]);
  //       setSelectedCustomer(null);
  //       setPaymentMethod("cash");
  //       setShowInvoice(true);
  //     } else {
  //       const errorData = await response.json();
  //       toast.error(errorData.message || "Failed to place order.");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting order:", error);
  //     toast.error("Error submitting order.");
  //   }
  // };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty. Please add items.");
      return;
    }

    if (!selectedCustomer) {
      toast.error("Please select a customer.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const orderData = {
        customerId: selectedCustomer.id,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total.toFixed(2),
        paymentMethod,
      };

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const savedOrder = await response.json();
        toast.success("Order placed successfully!");

        // ✅ Set Order Summary for Invoice
        setOrderSummary({
          customer: selectedCustomer,
          cart: [...cart],
          total,
          orderId: savedOrder.orderNumber,
          orderDate: new Date().toLocaleString(),
        });

        setShowInvoice(true); // ✅ Show Invoice

        // ✅ Reset Cart, Selected Customer, and Payment Method for New Order
        setTimeout(() => {
          setCart([]); // ✅ Clear Cart
          setSelectedCustomer(null); // ✅ Clear Customer Selection
          setCustomerKey((prevKey) => prevKey + 1); // Force Re-render
          setPaymentMethod("cash"); // ✅ Reset to Default Payment Method
          setDiscount(0); // ✅ Reset Discount
          setCouponCode(""); // ✅ Reset Coupon Code
          setPaymentStatus("PENDING"); // ✅ Reset Payment Status
        }, 500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Error submitting order.");
    }
  };

  const handlePrintReceipt = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      printWindow?.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                margin: 20px;
                padding: 20px;
                color: #333;
              }
              .invoice-container {
                max-width: 600px;
                margin: auto;
                padding: 20px;
                border: 1px solid #ddd;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
              }
              .invoice-header {
                text-align: center;
                margin-bottom: 20px;
              }
              .invoice-header h1 {
                font-size: 24px;
                margin: 0;
                color: #000;
              }
              .company-details, .customer-details {
                font-size: 14px;
                margin-bottom: 20px;
              }
              .invoice-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              .invoice-table th, .invoice-table td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
              }
              .invoice-table th {
                background-color: #f4f4f4;
              }
              .summary {
                font-size: 14px;
                margin-bottom: 20px;
              }
              .summary div {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
              }
              .total {
                font-size: 18px;
                font-weight: bold;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                margin-top: 20px;
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="invoice-header">
                <h1>INVOICE</h1>
              </div>
              
              <div class="company-details">
                <strong>RetailPro ERP</strong><br>
                123 Business Street, City, State 12345
              </div>
  
              <div class="customer-details">
                <strong>Customer</strong><br>
                ${orderSummary?.customer?.name || "N/A"}<br>
                ${orderSummary?.customer?.phone || "N/A"}<br>
                ${orderSummary?.customer?.email || "N/A"}
              </div>
  
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    orderSummary?.cart?.length > 0
                      ? orderSummary.cart
                          .map(
                            (item: any) => `
                            <tr>
                              <td>${item.name}</td>
                              <td>$${item.price.toFixed(2)}</td>
                              <td>${item.quantity}</td>
                              <td>$${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          `
                          )
                          .join("")
                      : `<tr><td colspan="4" style="text-align:center;">No items in the order</td></tr>`
                  }
                </tbody>
              </table>
  
              <div class="summary">
                <div><span>Subtotal:</span> <span>$${subtotal.toFixed(2)}</span></div>
                <div><span>Tax (8%):</span> <span>$${taxAmount.toFixed(2)}</span></div>
                <div class="total"><span>Total:</span> <span>$${total.toFixed(2)}</span></div>
              </div>
  
              <div class="footer">
                Thank you for your purchase!<br>
                For any questions or returns, please reference your Order ID: ${orderSummary?.orderId || orderId}
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
      printWindow?.close();
    }
  };

  // Generate order ID
  const orderId = `ORD-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;
  const orderDate = new Date().toLocaleString();

  // Today's sales data (mock)
  // const todaySales = {
  //   count: 24,
  //   revenue: 3249.95,
  //   averageOrder: 135.41,
  // };

  // Low stock products
  const lowStockProducts = products.filter((product) => product.stock < 10);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar Navigation */}
      {/* <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold">RetailPro ERP</h1>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            <nav className="space-y-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                  activeNav === "pos" && "bg-slate-800"
                )}
                onClick={() => setActiveNav("pos")}
              >
                <Home className="mr-2 h-5 w-5" />
                POS Dashboard
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-slate-800 hover:text-white"
                onClick={() => setActiveNav("orders")}
              >
                <FileText className="mr-2 h-5 w-5" />
                Orders
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-slate-800 hover:text-white"
                onClick={() => setActiveNav("products")}
              >
                <Package className="mr-2 h-5 w-5" />
                Products
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-slate-800 hover:text-white"
                onClick={() => setActiveNav("customers")}
              >
                <Users className="mr-2 h-5 w-5" />
                Customers
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-slate-800 hover:text-white"
                onClick={() => setActiveNav("reports")}
              >
                <BarChart2 className="mr-2 h-5 w-5" />
                Reports
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-slate-800 hover:text-white"
                onClick={() => setActiveNav("settings")}
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>
            </nav>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div> */}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        {/* <header className="h-16 border-b bg-white flex items-center px-6 justify-between">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Point of Sale</h2>
            <Badge variant="outline" className="ml-4 px-2 py-1">
              <Clock className="w-3 h-3 mr-1" />
              {new Date().toLocaleDateString()}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              <CheckCircle className="w-4 h-4 mr-1" />
              {todaySales.count} Sales Today
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <DollarSign className="w-4 h-4 mr-1" />$
              {todaySales.revenue.toFixed(2)} Revenue
            </Badge>
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </div>
        </header> */}

        <header className="h-16 border-b bg-white flex items-center px-6 justify-between">
          <div className="flex items-center">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-primary p-0"
            onClick={() => router.push("/dashboard")}
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
            <h2 className="text-xl font-semibold">Point of Sale</h2>
            <Badge variant="outline" className="ml-4 px-2 py-1">
              <Clock className="w-3 h-3 mr-1" />
              {new Date().toLocaleDateString()}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              <CheckCircle className="w-4 h-4 mr-1" />
              {todaySales.count || 0} Sales Today
            </Badge>
            <Badge variant="secondary">
              <DollarSign className="w-4 h-4 mr-1" />$
              {Number(todaySales.revenue || 0).toFixed(2)} Revenue
            </Badge>
            <Avatar>
              <AvatarImage
                src={user?.avatarUrl || "/placeholder.svg"}
                alt={user?.name}
              />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Products Panel */}
          <div className="w-3/5 flex flex-col border-r">
            {/* Search and Filters */}
            <div className="p-4 border-b bg-white">
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name, code or scan barcode..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter & Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="stock-asc">
                      Stock: Low to High
                    </SelectItem>
                    <SelectItem value="stock-desc">
                      Stock: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs
                defaultValue="all"
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex gap-2 overflow-auto">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      onClick={() => setActiveTab(category.id)}
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent key={category.id} value={category.id}>
                    {/* You can add content for each category here */}
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Products Grid */}
            <ScrollArea
              className="flex-1 p-4 overflow-auto"
              style={{ maxHeight: "calc(100vh - 200px)" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square bg-slate-50 flex items-center justify-center p-4">
                        <Image
                          src={`http://localhost:5000${product.images[0]}`}
                          alt=""
                          width={300}
                          height={300}
                          className="max-h-full object-contain"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium truncate">
                            {product.name}
                          </h3>
                          {product.stock < 10 && (
                            <Badge variant="destructive" className="text-xs">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-muted-foreground">
                            Stock: {product.stock}
                          </p>
                          <p className="font-bold text-primary">
                            ${parseFloat(product.price).toFixed(2)}
                          </p>
                        </div>

                        <Button
                          className="w-full"
                          size="sm"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                    <Search className="w-12 h-12 text-muted-foreground/50 mb-2" />
                    <h3 className="text-lg font-medium">No products found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Sales Insights */}
            <div className="border-t p-3 bg-slate-50">
              <div className="flex gap-4">
                <Card className="flex-1">
                  <CardContent className="p-3 flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <BarChart2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Today's Sales
                      </p>
                      <p className="font-bold">{todaySales.count} Orders</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex-1">
                  <CardContent className="p-3 flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="font-bold">
                        ${todaySales.revenue.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex-1">
                  <CardContent className="p-3 flex items-center">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Low Stock Items
                      </p>
                      <p className="font-bold">
                        {lowStockProducts.length} Products
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Cart & Checkout Panel */}
          <div className="w-2/5 flex flex-col bg-white">
            {/* Customer Selection */}

            <div className="p-4 border-b">
              <h3 className="font-medium mb-2">Customer</h3>
              <div className="flex gap-2">
                <Select
                  key={customerKey} // 🔥 Force React to re-render when customerKey changes
                  onValueChange={(value) => {
                    const customer = customers.find((c) => c.id === value);
                    setSelectedCustomer(customer);
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select or search customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} ({customer.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setShowNewCustomerDialog(true)}
                >
                  New
                </Button>
              </div>

              {selectedCustomer && (
                <div className="mt-2 p-2 bg-slate-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{selectedCustomer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedCustomer.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        {selectedCustomer.loyaltyPoints} Points
                      </span>
                      {selectedCustomer.creditBalance > 0 && (
                        <p className="text-xs text-green-600">
                          ${selectedCustomer.creditBalance.toFixed(2)} Credit
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-auto p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart Items ({cart.length})
              </h3>

              {cart.length > 0 ? (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-3 border rounded-lg bg-slate-50"
                    >
                      <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center mr-3 border">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={30}
                          height={30}
                          className="max-h-8 max-w-8"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <div className="flex justify-between text-sm">
                          <p>
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                          <p className="font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive ml-1"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed rounded-lg">
                  <ShoppingCart className="w-10 h-10 text-muted-foreground/50 mb-2" />
                  <h3 className="font-medium">Your cart is empty</h3>
                  <p className="text-sm text-muted-foreground">
                    Add products to begin your sale
                  </p>
                </div>
              )}
            </div>

            {/* Checkout Section */}
            <div className="p-4 border-t bg-slate-50">
              {/* Discount Section */}
              {/* <div className="mb-4">
                <div className="flex gap-2 mb-2">
                  <Input
                    type="number"
                    placeholder="Discount %"
                    className="w-1/2"
                    value={discount || ""}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                  <div className="relative w-1/2">
                    <Input
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full"
                      disabled={!couponCode}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div> */}

              {/* Order Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Payment Method</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={paymentMethod === "CASH" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setPaymentMethod("CASH")}
                    disabled={!selectedCustomer}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    CASH
                  </Button>
                  <Button
                    variant={paymentMethod === "CARD" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setPaymentMethod("CARD")}
                    disabled={!selectedCustomer}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    CARD
                  </Button>
                  <Button
                    variant={paymentMethod === "UPI" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setPaymentMethod("UPI")}
                    disabled={!selectedCustomer}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    UPI
                  </Button>
                  <Button
                    variant={paymentMethod === "OTHER" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setPaymentMethod("OTHER")}
                    disabled={!selectedCustomer}
                  >
                    <User className="w-4 h-4 mr-2" />
                    OTHER
                  </Button>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm Sale (${total.toFixed(2)})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* New Customer Dialog */}
      {/* <Dialog
        open={showNewCustomerDialog}
        onOpenChange={setShowNewCustomerDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Full Name</label>
              <Input id="name" placeholder="John Smith" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone">Phone Number</label>
              <Input id="phone" placeholder="555-123-4567" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">Email Address</label>
              <Input id="email" placeholder="john@example.com" type="email" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewCustomerDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // In a real app, you would save the customer to the database
                setShowNewCustomerDialog(false);
              }}
            >
              Save Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Invoice Dialog */}

      <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
        <DialogContent className="max-w-3xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>Order Summary</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[80vh] overflow-auto" ref={printRef}>
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-xl">INVOICE</h3>
                  <p className="text-muted-foreground">
                    Order ID: {orderSummary?.orderId || orderId}
                  </p>
                  <p className="text-muted-foreground">
                    Date: {orderSummary?.orderDate || orderDate}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold">RetailPro ERP</h3>
                  <p className="text-muted-foreground">123 Business Street</p>
                  <p className="text-muted-foreground">City, State 12345</p>
                </div>
              </div>

              {orderSummary?.customer && (
                <div className="mb-6 p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium mb-1">Customer</h4>
                  <p>{orderSummary.customer.name}</p>
                  <p className="text-muted-foreground">
                    {orderSummary.customer.phone}
                  </p>
                  <p className="text-muted-foreground">
                    {orderSummary.customer.email}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-left">
                      <tr>
                        <th className="p-3">Item</th>
                        <th className="p-3 text-right">Price</th>
                        <th className="p-3 text-right">Qty</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderSummary?.cart?.length > 0 ? (
                        orderSummary.cart.map((item: any) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-3 flex items-center gap-2">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="rounded"
                              />
                              {item.name}
                            </td>
                            <td className="p-3 text-right">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="p-3 text-right">{item.quantity}</td>
                            <td className="p-3 text-right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-3 text-center text-muted-foreground"
                          >
                            No items in the order
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <div className="w-1/2">
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p>
                      <span className="text-muted-foreground">Method:</span>{" "}
                      {orderSummary?.paymentMethod || paymentMethod}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <Badge variant="default">
                        {orderSummary?.paymentStatus || paymentStatus}
                      </Badge>
                    </p>
                  </div>
                </div>

                <div className="w-1/3">
                  <h4 className="font-medium mb-2">Order Summary</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>
                        $
                        {orderSummary?.total?.toFixed(2) || subtotal.toFixed(2)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        ${orderSummary?.total?.toFixed(2) || total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-muted-foreground text-sm mt-6">
                <p>Thank you for your purchase!</p>
                <p>
                  For any questions or returns, please reference your Order ID:{" "}
                  {orderSummary?.orderId || orderId}
                </p>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowInvoice(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Email Receipt
              </Button>
              <Button className="flex-1" onClick={handlePrintReceipt}>
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CustomerForm
        isOpen={showNewCustomerDialog}
        setIsOpen={setShowNewCustomerDialog}
        fetchCustomers={fetchCustomers}
      />
    </div>
  );
}
