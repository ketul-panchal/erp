"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

interface OrderItem {
  id?: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderFormState {
  customerId: string;
  status: string;
  items: OrderItem[];
  totalAmount: number;
}

export default function OrderForm({
  isOpen,
  setIsOpen,
  order,
  fetchOrders,
}: any) {
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>(
    []
  );
  const [products, setProducts] = useState<
    { id: string; name: string; price: number }[]
  >([]);
  const [form, setForm] = useState<OrderFormState>({
    customerId: "",
    status: "PENDING",
    items: [{ productId: "", quantity: 1, price: 0, total: 0 }],
    totalAmount: 0,
  });

  const [removedItems, setRemovedItems] = useState<string[]>([]); 

  //   useEffect(() => {
  //     fetchCustomers();
  //     fetchProducts();
  //     if (order) {
  //       setForm({
  //         customerId: order.customerId,
  //         status: order.status,
  //         items: order.items.map((item: any) => ({
  //           productId: item.product.id,
  //           quantity: item.quantity,
  //           price: item.price,
  //           total: item.quantity * item.price,
  //         })),
  //         totalAmount: order.totalAmount,
  //       });
  //     }
  //   }, [order]);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();

    if (order) {
      setForm({
        customerId: order.customerId,
        status: order.status,
        items: order.items.map((item: any) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
        totalAmount: order.totalAmount,
      });
    } else {
      setForm({
        customerId: "",
        status: "PENDING",
        items: [{ productId: "", quantity: 1, price: 0, total: 0 }],
        totalAmount: 0,
      });
    }
  }, [order]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch("http://localhost:5000/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: any
  ) => {
    setForm((prevForm) => {
      const updatedItems = [...prevForm.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };

      if (field === "productId") {
        const selectedProduct = products.find((p) => p.id === value);
        if (selectedProduct) {
          updatedItems[index].price = selectedProduct.price;
          updatedItems[index].total =
            selectedProduct.price * updatedItems[index].quantity;
        }
      }

      if (field === "quantity") {
        updatedItems[index].total = updatedItems[index].price * value;
      }

      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + item.total,
        0
      );

      return { ...prevForm, items: updatedItems, totalAmount: updatedTotal };
    });
  };

  const addItem = () => {
    setForm((prevForm) => {
      const newItem = { productId: "", quantity: 1, price: 0, total: 0 };
      const updatedItems = [...prevForm.items, newItem];
      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + item.total,
        0
      );

      return { ...prevForm, items: updatedItems, totalAmount: updatedTotal };
    });
  };

  const removeItem = (index: number) => {
    setForm((prevForm) => {
      const removedItemId = prevForm.items[index]?.id;
      if (removedItemId) {
        setRemovedItems((prevRemoved) => [...prevRemoved, removedItemId]);
      }

      const updatedItems = prevForm.items.filter((_, i) => i !== index);
      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + item.total,
        0
      );

      return { ...prevForm, items: updatedItems, totalAmount: updatedTotal };
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = order
      ? `http://localhost:5000/api/orders/${order.id}`
      : "http://localhost:5000/api/orders";
    const method = order ? "PUT" : "POST";

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized");
        return;
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        fetchOrders();
        toast.success(
          order ? "Order updated successfully!" : "Order created successfully!"
        );
        setIsOpen(false);
      } else {
        toast.error("Failed to save order.");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Error saving order.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{order ? "Edit Order" : "Add Order"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Selection */}
          <label>Customer</label>
          <select
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            value={form.customerId}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Customer</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.id}>
                {cust.name}
              </option>
            ))}
          </select>

          {/* Order Items */}
          <div className="space-y-3">
            <label>Order Items</label>
            {form.items.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <select
                  className="w-1/3 border p-2 rounded"
                  value={item.productId}
                  onChange={(e) =>
                    handleItemChange(index, "productId", e.target.value)
                  }
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} - ${prod.price}
                    </option>
                  ))}
                </select>

                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", Number(e.target.value))
                  }
                  placeholder="Quantity"
                  required
                />

                <Input type="text" value={`$${item.price}`} readOnly />

                <Input type="text" value={`$${item.total}`} readOnly />

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem(index)}
                >
                  ✕
                </Button>
              </div>
            ))}

            <Button type="button" className="w-full" onClick={addItem}>
              + Add Item
            </Button>
          </div>

          {/* Order Status */}
          <label>Status</label>
          <select
            className="w-full border p-2 rounded"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Total Amount */}
          <label>Total Amount</label>
          <Input type="text" value={`$${form.totalAmount}`} readOnly />

          <DialogFooter>
            <Button type="submit">
              {order ? "Update Order" : "Create Order"}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
