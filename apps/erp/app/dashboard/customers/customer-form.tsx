// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { toast } from "react-hot-toast";

// const customerSchema = z.object({
//   name: z.string().min(2, "Customer name must be at least 2 characters"),
//   email: z.string().email("Invalid email").optional(),
//   phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
//   address: z.string().min(5, "Address must be at least 5 characters").optional(),
// });

// export default function CustomerForm({ isOpen, setIsOpen, customer, fetchCustomers }: any) {
//   const { register, handleSubmit, reset, formState: { errors } } = useForm({
//     resolver: zodResolver(customerSchema),
//     defaultValues: customer || { name: "", email: "", phone: "", address: "" },
//   });

//   const onSubmit = async (data: any) => {
//     const token = localStorage.getItem("token");
//     const url = customer ? `http://localhost:5000/api/customers/${customer.id}` : "http://localhost:5000/api/customers";
//     const method = customer ? "PUT" : "POST";

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       if (response.ok) {
//         fetchCustomers();
//         toast.success(customer ? "Customer updated successfully!" : "Customer created successfully!");
//         setIsOpen(false);
//         reset();
//       } else {
//         toast.error("Failed to save customer.");
//       }
//     } catch (error) {
//       console.error("Error saving customer:", error);
//       toast.error("Error saving customer.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogContent>
//         <DialogHeader><DialogTitle>{customer ? "Edit Customer" : "Add Customer"}</DialogTitle></DialogHeader>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <Input placeholder="Customer Name" {...register("name")} />
//           {errors.name && <p className="text-red-500">{errors.name.message?.toString()}</p>}
//           <Input placeholder="Email" {...register("email")} />
//           {errors.email && <p className="text-red-500">{errors.email.message?.toString()}</p>}
//           <Input placeholder="Phone" {...register("phone")} />
//           {errors.phone && <p className="text-red-500">{errors.phone.message?.toString()}</p>}
//           <Input placeholder="Address" {...register("address")} />
//           {errors.address && <p className="text-red-500">{errors.address.message?.toString()}</p>}

//           <DialogFooter>
//             <Button type="submit">{customer ? "Update" : "Create"}</Button>
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

const customerSchema = z.object({
  name: z.string().min(2, "Customer name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  address: z.string().min(5, "Address must be at least 5 characters").optional(),
});

export default function CustomerForm({ isOpen, setIsOpen, customer, fetchCustomers }: any) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", email: "", phone: "", address: "" },
  });

  // When the customer changes, reset the form with new values
  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
      });
    } else {
      reset({ name: "", email: "", phone: "", address: "" });
    }
  }, [customer, reset]);

  const onSubmit = async (data: any) => {
    const token = localStorage.getItem("token");
    const url = customer
      ? `http://localhost:5000/api/customers/${customer.id}`
      : "http://localhost:5000/api/customers";
    const method = customer ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchCustomers();
        toast.success(customer ? "Customer updated successfully!" : "Customer created successfully!");
        setIsOpen(false);
        reset();
      } else {
        toast.error("Failed to save customer.");
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error("Error saving customer.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{customer ? "Edit Customer" : "Add Customer"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Customer Name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message?.toString()}</p>}

          <Input placeholder="Email" {...register("email")} />
          {errors.email && <p className="text-red-500">{errors.email.message?.toString()}</p>}

          <Input placeholder="Phone" {...register("phone")} />
          {errors.phone && <p className="text-red-500">{errors.phone.message?.toString()}</p>}

          <Input placeholder="Address" {...register("address")} />
          {errors.address && <p className="text-red-500">{errors.address.message?.toString()}</p>}

          <DialogFooter>
            <Button type="submit">{customer ? "Update" : "Create"}</Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
