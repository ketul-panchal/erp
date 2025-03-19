"use client";

import {
  DollarSign,
  Package,
  ShoppingCart,
  TruckIcon,
  Plus,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardPage() {
  const [user, setUser] = useState<{
    name: string;
    role: string;
    avatarUrl?: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      }
    };

    fetchUser();
  }, []);

  const metrics = [
    {
      title: "Total Orders",
      value: "2,345",
      change: "+12.5%",
      icon: ShoppingCart,
      description: "Orders this month",
    },
    {
      title: "Inventory Stock",
      value: "18,756",
      change: "-2.3%",
      icon: Package,
      description: "Items in stock",
    },
    {
      title: "Pending Shipments",
      value: "156",
      change: "+24.5%",
      icon: TruckIcon,
      description: "Awaiting shipment",
    },
    {
      title: "Total Revenue",
      value: "$345,897",
      change: "+8.2%",
      icon: DollarSign,
      description: "Current month",
    },
  ];

  const recentActivity = [
    {
      id: "ORD-7892",
      type: "New Order",
      description: "Order #ORD-7892 received from ABC Corp",
      user: "System",
      timestamp: "12 min ago",
      status: "New",
    },
    {
      id: "INV-5621",
      type: "Inventory Update",
      description: "SKU-1089 stock adjusted from 56 to 32 units",
      user: "Maria L.",
      timestamp: "45 min ago",
      status: "Updated",
    },
    {
      id: "SHP-3421",
      type: "Shipment Sent",
      description: "Order #ORD-7891 shipped via Express Logistics",
      user: "Robert K.",
      timestamp: "1 hour ago",
      status: "Completed",
    },
    {
      id: "USR-9012",
      type: "User Login",
      description: "Admin user logged in from new device",
      user: "Admin",
      timestamp: "2 hours ago",
      status: "Security",
    },
    {
      id: "PO-4532",
      type: "Purchase Order",
      description: "New PO created for vendor Acme Supplies",
      user: "John S.",
      timestamp: "3 hours ago",
      status: "Created",
    },
  ];

  const quickActions = [
    {
      title: "Add New Product",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => router.push("/dashboard/products"),
    },
    {
      title: "Manage Users",
      icon: Users,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => router.push("/dashboard/users"),
    },
    {
      title: "View Reports",
      icon: BarChart3,
      color: "bg-amber-500 hover:bg-amber-600",
    },
    {
      title: "Settings",
      icon: Settings,
      color: "bg-slate-500 hover:bg-slate-600",
    },
  ];

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Welcome Section */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
            Welcome, {user ? user.name : "Loading..."}
          </h2>
          <p className="text-muted-foreground">
            {user ? user.role : "Loading..."} |{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={user?.avatarUrl || "/placeholder.svg"}
            alt={user?.name}
          />
          <AvatarFallback>
            {user
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "U"}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="py-6">
        <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
                <div
                  className={`mt-2 text-xs ${metric.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                >
                  {metric.change} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="py-6">
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, i) => (
            <Button
              key={i}
              className={`h-auto py-4 text-white ${action.color}`}
              variant="default"
              onClick={action.onClick}
            >
              <action.icon className="mr-2 h-5 w-5" />
              {action.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="py-6">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              Recent system activities and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Description
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">
                        {activity.id}
                      </TableCell>
                      <TableCell>{activity.type}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-md truncate">
                        {activity.description}
                      </TableCell>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {activity.timestamp}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            activity.status === "New"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : activity.status === "Updated"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : activity.status === "Completed"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : activity.status === "Security"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
