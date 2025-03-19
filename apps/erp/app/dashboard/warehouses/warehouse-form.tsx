"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "react-toastify";

const warehouseSchema = z.object({
  name: z.string().min(2, "Warehouse name must be at least 2 characters"),
  location: z.string().min(5, "Location must be at least 5 characters").optional(),
});

export default function WarehouseForm({ isOpen, setIsOpen, warehouse, fetchWarehouses }: any) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(warehouseSchema),
    defaultValues: { name: "", location: "" },
  });

  // Populate form when editing
  useEffect(() => {
    if (warehouse) {
      setValue("name", warehouse.name);
      setValue("location", warehouse.location || "");
    } else {
      reset();
    }
  }, [warehouse, setValue, reset]);

  const onSubmit = async (data: any) => {
    const token = localStorage.getItem("token");
    const url = warehouse
      ? `http://localhost:5000/api/warehouses/${warehouse.id}`
      : "http://localhost:5000/api/warehouses";
    const method = warehouse ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchWarehouses();
        toast.success(warehouse ? "Warehouse updated successfully!" : "Warehouse created successfully!");
        setIsOpen(false);
        reset();
      } else {
        toast.error("Failed to save warehouse.");
      }
    } catch (error) {
      console.error("Error saving warehouse:", error);
      toast.error("Error saving warehouse.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{warehouse ? "Edit Warehouse" : "Add Warehouse"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Warehouse Name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message?.toString()}</p>}

          <Input placeholder="Location (Optional)" {...register("location")} />
          {errors.location && <p className="text-red-500">{errors.location.message?.toString()}</p>}

          <DialogFooter>
            <Button type="submit">{warehouse ? "Update" : "Create"}</Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
