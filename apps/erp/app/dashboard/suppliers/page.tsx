"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";
import SupplierForm from "./supplier-form";
import { toast } from "react-hot-toast";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      } else {
        toast.error("Failed to fetch suppliers.");
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("Error fetching suppliers.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/suppliers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
        toast.success("Supplier deleted successfully.");
      } else {
        toast.error("Failed to delete supplier.");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Error deleting supplier.");
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-2xl font-bold">Suppliers</h2>
        <Button onClick={() => { setEditingSupplier(null); setIsFormOpen(true); }} className="bg-blue-600 text-white flex items-center">
          <Plus className="mr-2 h-5 w-5" /> Add Supplier
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Supplier List</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.email || "-"}</TableCell>
                    <TableCell>{supplier.phone || "-"}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="icon" className="mr-2" onClick={() => { setEditingSupplier(supplier); setIsFormOpen(true); }}>
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(supplier.id)}>
                        <Trash className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SupplierForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} supplier={editingSupplier} fetchSuppliers={fetchSuppliers} />
    </div>
  );
}
