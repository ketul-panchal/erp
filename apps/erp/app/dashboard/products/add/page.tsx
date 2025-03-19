// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "react-toastify";

// export default function AddProductPage() {
//   const [form, setForm] = useState({
//     name: "",
//     sku: "",
//     price: "",
//     costPrice: "",
//     stock: "",
//   });
//   const router = useRouter();

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(form),
//       });

//       if (response.ok) {
//         toast.success("Product added successfully!");
//         router.push("/dashboard/products");
//       } else {
//         toast.error("Failed to add product.");
//       }
//     } catch (error) {
//       toast.error("Server error.");
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold">Add Product</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           placeholder="Product Name"
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           required
//         />
//         <Input
//           placeholder="SKU"
//           onChange={(e) => setForm({ ...form, sku: e.target.value })}
//           required
//         />
//         <Input
//           placeholder="Price"
//           type="number"
//           onChange={(e) => setForm({ ...form, price: e.target.value })}
//           required
//         />
//         <Input
//           placeholder="Cost Price"
//           type="number"
//           onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
//           required
//         />
//         <Input
//           placeholder="Stock"
//           type="number"
//           onChange={(e) => setForm({ ...form, stock: e.target.value })}
//           required
//         />
//         <Button type="submit" className="bg-blue-500 text-white">
//           Add Product
//         </Button>
//       </form>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    sku: "",
    barcode: "",
    categoryId: "",
    brand: "",
    supplierId: "",
    price: "",
    costPrice: "",
    stock: "",
    stockAlert: "10",
    warehouseId: "",
    images: [],
    status: "ACTIVE",
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const fetchAPI = async (url: string) => {
          const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
          return res.ok ? res.json() : [];
        };

        setCategories(await fetchAPI("http://localhost:5000/api/categories"));
        setSuppliers(await fetchAPI("http://localhost:5000/api/suppliers"));
        setWarehouses(await fetchAPI("http://localhost:5000/api/warehouses"));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Upload images
      const formData = new FormData();
      selectedImages.forEach((file) => formData.append("images", file));

      const uploadResponse = await fetch("http://localhost:5000/api/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!uploadResponse.ok) {
        toast.error("Image upload failed.");
        return;
      }

      const uploadedImageUrls = await uploadResponse.json();
      const productData = { ...form, images: uploadedImageUrls };

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        router.push("/dashboard/products");
      } else {
        toast.error("Failed to add product.");
      }
    } catch (error) {
      toast.error("Server error.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Product Name</label>
          <Input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium">SKU</label>
          <Input
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Barcode (Optional)</label>
          <Input
            placeholder="Barcode"
            value={form.barcode}
            onChange={(e) => setForm({ ...form, barcode: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium">Brand</label>
          <Input
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium">Price</label>
          <Input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Cost Price</label>
          <Input
            placeholder="Cost Price"
            type="number"
            value={form.costPrice}
            onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Stock</label>
          <Input
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Stock Alert</label>
          <Input
            placeholder="Stock Alert"
            type="number"
            value={form.stockAlert}
            onChange={(e) => setForm({ ...form, stockAlert: e.target.value })}
          />
        </div>

        {/* Category Dropdown */}
        <label className="block font-medium">Category</label>
        <Select onValueChange={(value) => setForm({ ...form, categoryId: value })}>
          <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
          <SelectContent>{categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent>
        </Select>

        {/* Supplier Dropdown */}
        <label className="block font-medium">Supplier</label>
        <Select onValueChange={(value) => setForm({ ...form, supplierId: value })}>
          <SelectTrigger><SelectValue placeholder="Select Supplier" /></SelectTrigger>
          <SelectContent>{suppliers.map((sup) => <SelectItem key={sup.id} value={sup.id}>{sup.name}</SelectItem>)}</SelectContent>
        </Select>

        {/* Warehouse Dropdown */}
        <label className="block font-medium">Warehouse</label>
        <Select onValueChange={(value) => setForm({ ...form, warehouseId: value })}>
          <SelectTrigger><SelectValue placeholder="Select Warehouse" /></SelectTrigger>
          <SelectContent>{warehouses.map((wh) => <SelectItem key={wh.id} value={wh.id}>{wh.name}</SelectItem>)}</SelectContent>
        </Select>

        {/* Image Upload */}
        <label className="block font-medium">Upload Images</label>
        <Input type="file" multiple accept="image/*" onChange={handleImageUpload} />

        <Button type="submit" className="bg-blue-500 text-white">
          Add Product
        </Button>
      </form>
    </div>
  );
}
