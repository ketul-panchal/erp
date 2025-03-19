"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";
import WarehouseForm from "./warehouse-form";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/warehouses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setWarehouses(data);
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this warehouse?")) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/warehouses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchWarehouses();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-2xl font-bold">Warehouses</h2>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-5 w-5" /> Add Warehouse
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Warehouse List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell>{warehouse.name}</TableCell>
                  <TableCell>{warehouse.location}</TableCell>
                  <TableCell>
                    <Button className="mr-2" variant="outline" onClick={() => { setSelectedWarehouse(warehouse); setIsOpen(true); }}>
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(warehouse.id)}>
                      <Trash className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <WarehouseForm isOpen={isOpen} setIsOpen={setIsOpen} warehouse={selectedWarehouse} fetchWarehouses={fetchWarehouses} />
    </div>
  );
}
