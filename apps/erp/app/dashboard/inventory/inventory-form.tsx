"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

export default function InventoryForm({ isOpen, setIsOpen, stock, fetchInventory }: any) {
  const [form, setForm] = useState({
    productId: "",
    warehouseId: "",
    stock: "",
    stockAlert: "10",
  });

  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
    if (stock) {
      setForm({
        productId: stock.id,
        warehouseId: stock.warehouseId || "",
        stock: stock.stock.toString(),
        stockAlert: stock.stockAlert.toString(),
      });
    }
  }, [stock]);

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setProducts(await response.json());
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ✅ Fetch Warehouses
  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/warehouses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setWarehouses(await response.json());
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = stock ? `http://localhost:5000/api/inventory/${stock.id}` : "http://localhost:5000/api/inventory";
    const method = stock ? "PUT" : "POST";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        fetchInventory();
        toast.success(stock ? "Stock updated successfully!" : "Stock added successfully!");
        setIsOpen(false);
      } else {
        toast.error("Failed to save stock.");
      }
    } catch (error) {
      console.error("Error saving stock:", error);
      toast.error("Error saving stock.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stock ? "Edit Stock" : "Add Stock"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          <label>Product</label>
          <select
            className="w-full border p-2 rounded"
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            required
            disabled={!!stock} // Disable selection when editing stock
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Warehouse Selection */}
          <label>Warehouse</label>
          <select
            className="w-full border p-2 rounded"
            value={form.warehouseId}
            onChange={(e) => setForm({ ...form, warehouseId: e.target.value })}
            required
          >
            <option value="">Select Warehouse</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          {/* Stock Quantity */}
          <label>Stock Quantity</label>
          <Input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />

          {/* Stock Alert Level */}
          <label>Stock Alert Level</label>
          <Input
            type="number"
            value={form.stockAlert}
            onChange={(e) => setForm({ ...form, stockAlert: e.target.value })}
          />

          <DialogFooter>
            <Button type="submit">{stock ? "Update Stock" : "Add Stock"}</Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
