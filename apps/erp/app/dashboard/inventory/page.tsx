// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { toast } from "react-hot-toast";

// export default function InventoryPage() {
//   const [inventory, setInventory] = useState<any[]>([]);

//   useEffect(() => {
//     fetchInventory();
//   }, []);

//   const fetchInventory = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/inventory", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         setInventory(await response.json());
//       } else {
//         toast.error("Failed to fetch inventory.");
//       }
//     } catch (error) {
//       console.error("Error fetching inventory:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold">Inventory Management</h2>

//       <Card className="mt-6">
//         <CardHeader>
//           <CardTitle>Stock Overview</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <Table>
//               {/* ✅ Corrected Table Head Structure */}
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Product</TableHead>
//                   <TableHead>Warehouse</TableHead>
//                   <TableHead>Stock</TableHead>
//                   <TableHead>Stock Alert</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {inventory.length > 0 ? (
//                   inventory.map((item) => (
//                     <TableRow key={item.id}>
//                       <TableCell>{item.product?.name}</TableCell>
//                       <TableCell>{item.warehouse?.name || "N/A"}</TableCell>
//                       <TableCell>{item.stock}</TableCell>
//                       <TableCell>{item.stockAlert}</TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={4} className="text-center">
//                       No inventory data available.
//                     </TableCell>
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

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import InventoryForm from "./inventory-form";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<any | null>(null);

  useEffect(() => {
    fetchInventory();
    fetchLowStockProducts();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setInventory(await response.json());
      } else {
        toast.error("Failed to fetch inventory.");
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/inventory/low-stock",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setLowStockProducts(await response.json());
      }
    } catch (error) {
      console.error("Error fetching low-stock products:", error);
    }
  };

  // ✅ Handle Add Stock button click (Reset Form)
  const handleAddStock = () => {
    setEditingStock(null); // Reset editing state
    setIsOpen(true);
  };

  // ✅ Handle Edit button click (Open Form with Data)
  const handleEditStock = (item: any) => {
    setEditingStock(item);
    setIsOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">Inventory Management</h2>

      {/* 🔔 Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-100 text-red-600 p-4 rounded mt-4">
          <strong>Low Stock Alert!</strong>
          <ul className="mt-2">
            {lowStockProducts.map((p) => (
              <li key={p.id}>{p.name} is below stock alert level.</li>
            ))}
          </ul>
        </div>
      )}

      {/* 📦 Inventory Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Stock Overview</CardTitle>
          <Button onClick={handleAddStock}>+ Add Stock</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Stock Alert</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.warehouse?.name || "N/A"}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>{item.stockAlert}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => handleEditStock(item)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No inventory data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Inventory Form */}
      <InventoryForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        stock={editingStock}
        fetchInventory={fetchInventory}
      />
    </div>
  );
}
