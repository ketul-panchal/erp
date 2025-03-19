// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { toast } from "react-hot-toast";

// const supplierSchema = z.object({
//   name: z.string().min(2, "Supplier name must be at least 2 characters"),
//   email: z.string().email("Invalid email").optional(),
//   phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
//   address: z.string().min(5, "Address must be at least 5 characters").optional(),
// });

// export default function SupplierForm({ isOpen, setIsOpen, supplier, fetchSuppliers }: any) {
//   const { register, handleSubmit, reset, formState: { errors } } = useForm({
//     resolver: zodResolver(supplierSchema),
//     defaultValues: supplier || { name: "", email: "", phone: "", address: "" },
//   });

//   const onSubmit = async (data: any) => {
//     const token = localStorage.getItem("token");
//     const url = supplier ? `http://localhost:5000/api/suppliers/${supplier.id}` : "http://localhost:5000/api/suppliers";
//     const method = supplier ? "PUT" : "POST";

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       if (response.ok) {
//         fetchSuppliers();
//         toast.success(supplier ? "Supplier updated successfully!" : "Supplier created successfully!");
//         setIsOpen(false);
//         reset();
//       } else {
//         toast.error("Failed to save supplier.");
//       }
//     } catch (error) {
//       console.error("Error saving supplier:", error);
//       toast.error("Error saving supplier.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogContent>
//         <DialogHeader><DialogTitle>{supplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle></DialogHeader>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <Input placeholder="Supplier Name" {...register("name")} />
//           {errors.name && <p className="text-red-500">{errors.name.message?.toString()}</p>}
//           <Input placeholder="Email" {...register("email")} />
//           {errors.email && <p className="text-red-500">{errors.email.message?.toString()}</p>}
//           <Input placeholder="Phone" {...register("phone")} />
//           {errors.phone && <p className="text-red-500">{errors.phone.message?.toString()}</p>}
//           <Input placeholder="Address" {...register("address")} />
//           {errors.address && <p className="text-red-500">{errors.address.message?.toString()}</p>}

//           <DialogFooter>
//             <Button type="submit">{supplier ? "Update" : "Create"}</Button>
//             <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

const supplierSchema = z.object({
  name: z.string().min(2, "Supplier name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  address: z.string().min(5, "Address must be at least 5 characters").optional(),
});

export default function SupplierForm({ isOpen, setIsOpen, supplier, fetchSuppliers }: any) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: { name: "", email: "", phone: "", address: "" },
  });

  // When the supplier changes, reset the form with new values
  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
      });
    } else {
      reset({ name: "", email: "", phone: "", address: "" });
    }
  }, [supplier, reset]);

  const onSubmit = async (data: any) => {
    const token = localStorage.getItem("token");
    const url = supplier
      ? `http://localhost:5000/api/suppliers/${supplier.id}`
      : "http://localhost:5000/api/suppliers";
    const method = supplier ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchSuppliers();
        toast.success(supplier ? "Supplier updated successfully!" : "Supplier created successfully!");
        setIsOpen(false);
        reset();
      } else {
        toast.error("Failed to save supplier.");
      }
    } catch (error) {
      console.error("Error saving supplier:", error);
      toast.error("Error saving supplier.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{supplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Supplier Name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message?.toString()}</p>}

          <Input placeholder="Email" {...register("email")} />
          {errors.email && <p className="text-red-500">{errors.email.message?.toString()}</p>}

          <Input placeholder="Phone" {...register("phone")} />
          {errors.phone && <p className="text-red-500">{errors.phone.message?.toString()}</p>}

          <Input placeholder="Address" {...register("address")} />
          {errors.address && <p className="text-red-500">{errors.address.message?.toString()}</p>}

          <DialogFooter>
            <Button type="submit">{supplier ? "Update" : "Create"}</Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
