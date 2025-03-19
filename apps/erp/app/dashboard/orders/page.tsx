"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Plus, Edit, Trash } from "lucide-react";
import OrderForm from "./order-form";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        toast.error("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders.");
    }
  };

  // ✅ Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Order deleted successfully!");
        fetchOrders();
      } else {
        toast.error("Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <Button onClick={() => setIsFormOpen(true)} className="bg-blue-600 text-white flex items-center">
          <Plus className="mr-2 h-5 w-5" /> Add Order
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>${order.totalAmount}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="icon" className="mr-2" onClick={() => { setEditingOrder(order); setIsFormOpen(true); }}>
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(order.id)}>
                        <Trash className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Form for Add/Edit */}
      {isFormOpen && <OrderForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} order={editingOrder} fetchOrders={fetchOrders} />}
    </div>
  );
}
