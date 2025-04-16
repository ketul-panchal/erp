// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Plus, Edit, Trash } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";

// export default function ProductsPage() {
//   const [products, setProducts] = useState<any[]>([]);
//   const [editingProduct, setEditingProduct] = useState<any | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Fetch Products
//   const fetchProducts = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       const response = await fetch("http://localhost:5000/api/products", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setProducts(data);
//       } else {
//         console.error("Failed to fetch products");
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   // Delete Product
//   const handleDelete = async (id: string) => {
//     const confirmDelete = confirm("Are you sure you want to delete this product?");
//     if (!confirmDelete) return;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`http://localhost:5000/api/products/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         toast.success("Product deleted successfully!");
//         setProducts((prev) => prev.filter((product) => product.id !== id));
//       } else {
//         toast.error("Failed to delete product");
//       }
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   // Handle Edit Click
//   const handleEdit = (product: any) => {
//     setEditingProduct(product);
//   };

//   // Update Product
//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingProduct) return;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(editingProduct),
//       });

//       if (response.ok) {
//         toast.success("Product updated successfully!");
//         fetchProducts();
//         setEditingProduct(null);
//       } else {
//         toast.error("Failed to update product");
//       }
//     } catch (error) {
//       console.error("Error updating product:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
//       <div className="flex items-center justify-between pb-4 border-b">
//         <h2 className="text-2xl font-bold">Product Inventory</h2>
//         <Button
//           className="bg-blue-600 text-white flex items-center"
//           onClick={() => router.push("/dashboard/products/add")} // Navigate to Add Product Page
//         >
//           <Plus className="mr-2 h-5 w-5" /> Add Product
//         </Button>
//       </div>

//       <Card className="mt-6">
//         <CardHeader>
//           <CardTitle>Product List</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Stock</TableHead>
//                   <TableHead>Price</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {products.length > 0 ? (
//                   products.map((product) => (
//                     <TableRow key={product.id}>
//                       <TableCell>{product.name}</TableCell>
//                       <TableCell>{product.stock}</TableCell>
//                       <TableCell>${product.price}</TableCell>
//                       <TableCell>
//                         {/* Edit Button */}
//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
//                               <Edit className="h-5 w-5" />
//                             </Button>
//                           </DialogTrigger>
//                           {editingProduct && editingProduct.id === product.id && (
//                             <DialogContent>
//                               <DialogTitle>Edit Product</DialogTitle>
//                               <form onSubmit={handleUpdate} className="space-y-4">
//                                 <label htmlFor="name">Product Name</label>
//                                 <Input
//                                   value={editingProduct.name}
//                                   onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
//                                   placeholder="Product Name"
//                                   required
//                                 />
//                                 <label htmlFor="price">Price</label>
//                                 <Input
//                                   value={editingProduct.price}
//                                   type="number"
//                                   onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
//                                   placeholder="Price"
//                                   required
//                                 />
//                                 <label htmlFor="stock">Stock</label>
//                                 <Input
//                                   value={editingProduct.stock}
//                                   type="number"
//                                   onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
//                                   placeholder="Stock"
//                                   required
//                                 />
//                                 <Button type="submit" className="bg-green-600 text-white w-full">Update Product</Button>
//                               </form>
//                             </DialogContent>
//                           )}
//                         </Dialog>

//                         {/* Delete Button */}
//                         <Button
//                           variant="destructive"
//                           size="icon"
//                           onClick={() => handleDelete(product.id)}
//                           className="ml-2"
//                         >
//                           <Trash className="h-5 w-5" />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={4} className="text-center">No products found.</TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  // For editing
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Control whether the edit dialog is open or closed
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
    fetchWarehouses();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/warehouses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWarehouses(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Product deleted successfully!");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // When user clicks on the "Edit" button:
  const handleEdit = (product: any) => {
    // Store the product in state so we can pre-fill the form
    setEditingProduct({ ...product });
    // Open the dialog
    setIsDialogOpen(true);
  };

  // Handle the form submission for product updates
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", editingProduct.name);
      formData.append("description", editingProduct.description || "");
      formData.append("sku", editingProduct.sku);
      formData.append("barcode", editingProduct.barcode || "0");
      formData.append("brand", editingProduct.brand || "0");
      formData.append("price", editingProduct.price || "0");
      formData.append("costPrice", editingProduct.costPrice || "0");
      formData.append("stock", editingProduct.stock);
      formData.append("stockAlert", editingProduct.stockAlert || "10");
      formData.append("categoryId", editingProduct.categoryId);
      formData.append("supplierId", editingProduct.supplierId || "");
      formData.append("warehouseId", editingProduct.warehouseId || "");
      formData.append("status", editingProduct.status || "ACTIVE");
      if (selectedImage) formData.append("image", selectedImage);

      const response = await fetch(
        `http://localhost:5000/api/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("Product updated successfully!");
        setIsDialogOpen(false);
        fetchProducts();
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-2xl font-bold">Product Inventory</h2>
        <Button
          className="bg-blue-600 text-white flex items-center"
          onClick={() => router.push("/dashboard/products/add")}
        >
          <Plus className="mr-2 h-5 w-5" /> Add Product
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.category?.name || "N/A"}</TableCell>
                  <TableCell>{product.supplier?.name || "N/A"}</TableCell>
                  <TableCell>{product.warehouse?.name || "N/A"}</TableCell>
                  <TableCell>
                    {product.images?.length ? (
                      <Image
                        src={`http://localhost:5000${product.images[0]}`}
                        width={50}
                        height={50}
                        alt="Product Image"
                        // unoptimized
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                      className="ml-2"
                    >
                      <Trash className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* EDIT DIALOG: Open/close is controlled by isDialogOpen */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent  className="w-full h-full max-w-2xl sm:w-[95%] max-h-[90vh] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the information for this product.
            </DialogDescription>
          </DialogHeader>

          {editingProduct && (
            //   <form onSubmit={handleUpdate}>
            //   <div className="space-y-4 mt-4">
            //     <Input
            //       type="text"
            //       placeholder="Product Name"
            //       value={editingProduct.name || ""}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
            //       required
            //     />

            //     <Textarea
            //       placeholder="Description"
            //       value={editingProduct.description || ""}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
            //     />

            //     <Input
            //       type="text"
            //       placeholder="SKU"
            //       value={editingProduct.sku || ""}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
            //       required
            //     />

            //     <Input
            //       type="text"
            //       placeholder="Barcode (Optional)"
            //       value={editingProduct.barcode || ""}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, barcode: e.target.value })}
            //     />

            //     <Input
            //       type="text"
            //       placeholder="Brand"
            //       value={editingProduct.brand || ""}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
            //     />

            //     <Input
            //       type="number"
            //       placeholder="Price"
            //       value={editingProduct.price || ""}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
            //       required
            //     />

            //     <Input
            //       type="number"
            //       placeholder="Price"
            //       value={editingProduct.price || ""}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
            //       required
            //     />

            //     <Input
            //       type="number"
            //       placeholder="Cost Price"
            //       value={editingProduct.costPrice || ""}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: e.target.value })}
            //       required
            //     />

            //     <Input
            //       type="number"
            //       placeholder="Stock"
            //       value={editingProduct.stock || ""}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
            //       required
            //     />

            //     <Input
            //       type="number"
            //       placeholder="Stock Alert"
            //       value={editingProduct.stockAlert || ""}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, stockAlert: e.target.value })}
            //     />

            //     {/* Category */}
            //     <select
            //       value={editingProduct.categoryId || ""}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
            //       className="border rounded p-2 w-full"
            //       required
            //     >
            //       <option value="">Select Category</option>
            //       {categories.map((cat) => (
            //         <option key={cat.id} value={cat.id}>{cat.name}</option>
            //       ))}
            //     </select>

            //     {/* Supplier */}
            //     <select
            //       value={editingProduct.supplierId || ""}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, supplierId: e.target.value })}
            //       className="border rounded p-2 w-full"
            //     >
            //       <option value="">Select Supplier</option>
            //       {suppliers.map((sup) => (
            //         <option key={sup.id} value={sup.id}>{sup.name}</option>
            //       ))}
            //     </select>

            //     {/* Warehouse */}
            //     <select
            //       value={editingProduct.warehouseId || ""}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, warehouseId: e.target.value })}
            //       className="border rounded p-2 w-full"
            //     >
            //       <option value="">Select Warehouse</option>
            //       {warehouses.map((wh) => (
            //         <option key={wh.id} value={wh.id}>{wh.name}</option>
            //       ))}
            //     </select>

            //     {/* Status */}
            //     <select
            //       value={editingProduct.status || "ACTIVE"}
            //       onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
            //       className="border rounded p-2 w-full"
            //     >
            //       <option value="ACTIVE">Active</option>
            //       <option value="INACTIVE">Inactive</option>
            //     </select>

            //     {/* Image Upload */}
            //     <Input
            //       type="file"
            //       onChange={(e) => setSelectedImage(e.target.files ? e.target.files[0] : null)}
            //     />
            //   </div>

            //   <DialogFooter className="mt-4">
            //     <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            //     <Button type="submit">Update</Button>
            //   </DialogFooter>
            // </form>

            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Product Name */}
                <div>
                  <label className="font-medium">Product Name</label>
                  <Input
                    type="text"
                    placeholder="Product Name"
                    value={editingProduct.name || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="font-medium">SKU</label>
                  <Input
                    type="text"
                    placeholder="SKU"
                    value={editingProduct.sku || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        sku: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="font-medium">Price</label>
                  <Input
                    type="number"
                    placeholder="Price"
                    value={editingProduct.price || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Cost Price */}
                <div>
                  <label className="font-medium">Cost Price</label>
                  <Input
                    type="number"
                    placeholder="Cost Price"
                    value={editingProduct.costPrice || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        costPrice: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="font-medium">Stock</label>
                  <Input
                    type="number"
                    placeholder="Stock"
                    value={editingProduct.stock || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Stock Alert */}
                <div>
                  <label className="font-medium">Stock Alert</label>
                  <Input
                    type="number"
                    placeholder="Stock Alert"
                    value={editingProduct.stockAlert || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stockAlert: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Barcode */}
                <div>
                  <label className="font-medium">Barcode</label>
                  <Input
                    type="text"
                    placeholder="Barcode"
                    value={editingProduct.barcode || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        barcode: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="font-medium">Brand</label>
                  <Input
                    type="text"
                    placeholder="Brand"
                    value={editingProduct.brand || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        brand: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Category */}
                <div className="md:col-span-1">
                  <label className="font-medium">Category</label>
                  <select
                    value={editingProduct.categoryId || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        categoryId: e.target.value,
                      })
                    }
                    className="border rounded p-2 w-full"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Supplier */}
                <div className="md:col-span-1">
                  <label className="font-medium">Supplier</label>
                  <select
                    value={editingProduct.supplierId || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        supplierId: e.target.value,
                      })
                    }
                    className="border rounded p-2 w-full"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Warehouse */}
                <div className="md:col-span-1">
                  <label className="font-medium">Warehouse</label>
                  <select
                    value={editingProduct.warehouseId || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        warehouseId: e.target.value,
                      })
                    }
                    className="border rounded p-2 w-full"
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="md:col-span-1">
                  <label className="font-medium">Status</label>
                  <select
                    value={editingProduct.status || "ACTIVE"}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        status: e.target.value,
                      })
                    }
                    className="border rounded p-2 w-full"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="font-medium">Description</label>
                  <Textarea
                    placeholder="Description"
                    value={editingProduct.description || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="font-medium">Upload Image</label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      setSelectedImage(
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
