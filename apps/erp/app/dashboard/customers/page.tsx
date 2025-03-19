"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";
import CustomerForm from "./customer-form";
import { toast } from "react-hot-toast";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        toast.error("Failed to fetch customers.");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Error fetching customers.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setCustomers((prev) => prev.filter((customer) => customer.id !== id));
        toast.success("Customer deleted successfully.");
      } else {
        toast.error("Failed to delete customer.");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Error deleting customer.");
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Button onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }} className="bg-blue-600 text-white flex items-center">
          <Plus className="mr-2 h-5 w-5" /> Add Customer
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Customer List</CardTitle></CardHeader>
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
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email || "-"}</TableCell>
                    <TableCell>{customer.phone || "-"}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="icon" className="mr-2" onClick={() => { setEditingCustomer(customer); setIsFormOpen(true); }}>
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(customer.id)}>
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

      <CustomerForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} customer={editingCustomer} fetchCustomers={fetchCustomers} />
    </div>
  );
}
