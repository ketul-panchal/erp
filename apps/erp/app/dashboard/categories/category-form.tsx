// "use client";

// import { useState, useEffect } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "react-hot-toast";
// import router from "next/router";

// // Define Category Type
// interface Category {
//   id: string;
//   name: string;
//   parentId?: string | null;
// }

// // Define Props
// interface CategoryFormProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   category: Category | null;
//   setCategories: (categories: (prev: Category[]) => Category[]) => void;
// }

// export default function CategoryForm({ isOpen, setIsOpen, category, setCategories }: CategoryFormProps) {
//   const [name, setName] = useState<string>("");
//   const [parentId, setParentId] = useState<string>("");

//   useEffect(() => {
//     if (category) {
//       setName(category.name);
//       setParentId(category.parentId || "");
//     } else {
//       setName("");
//       setParentId("");
//     }
//   }, [category]);

//   const fetchCategories = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/login");
//         return;
//       }
  
//       const response = await fetch("http://localhost:5000/api/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       if (response.ok) {
//         const data = await response.json();
//         setCategories(data);
//       } else {
//         console.error("Failed to fetch categories");
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };
  

//   const handleSubmit = async () => {
//     const token = localStorage.getItem("token");
//     const url = category ? `http://localhost:5000/api/categories/${category.id}` : "http://localhost:5000/api/categories";
//     const method = category ? "PUT" : "POST";

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, parentId: parentId || null }),
//       });

//       if (response.ok) {
//         const updatedCategory: Category = await response.json();

//         // Update state correctly
//         setCategories((prev: Category[]) =>
//           category
//             ? prev.map((cat) => (cat.id === category.id ? updatedCategory : cat)) // Edit category
//             : [...prev, updatedCategory] // Add new category
//         );
//         fetchCategories(); // Re-fetch updated categories after add/edit
//         toast.success(category ? "Category updated successfully!" : "Category created successfully!");
//         setIsOpen(false);
//       } else {
//         toast.error("Failed to save category.");
//       }
//     } catch (error) {
//       console.error("Error saving category:", error);
//       toast.error("Error saving category.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <Input placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} />
//           <Input placeholder="Parent Category ID (Optional)" value={parentId} onChange={(e) => setParentId(e.target.value)} />
//         </div>
//         <DialogFooter>
//           <Button onClick={handleSubmit}>{category ? "Update" : "Create"}</Button>
//           <Button variant="outline" onClick={() => setIsOpen(false)}>
//             Cancel
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import router from "next/router";

// Category Interface
interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  image?: string;
}

interface CategoryFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  category: Category | null;
  setCategories: (categories: (prev: Category[]) => Category[]) => void;
}

export default function CategoryForm({ isOpen, setIsOpen, category, setCategories }: CategoryFormProps) {
  const [name, setName] = useState<string>("");
  const [parentId, setParentId] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setParentId(category.parentId || "");
    } else {
      setName("");
      setParentId("");
      setImageFile(null);
    }
  }, [category]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      let imageUrl = "";

      // ✅ Upload Image First if Exists
      if (imageFile) {
        const imageForm = new FormData();
        imageForm.append("image", imageFile);

        const uploadRes = await fetch("http://localhost:5000/api/uploads/categories", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: imageForm,
        });

        if (!uploadRes.ok) {
          toast.error("Image upload failed");
          return;
        }

        const uploaded = await uploadRes.json();
        imageUrl = uploaded.imageUrl;  // Your backend should return the image path
      }

      const url = category
        ? `http://localhost:5000/api/categories/${category.id}`
        : "http://localhost:5000/api/categories";

      const method = category ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          parentId: parentId || null,
          image: imageUrl || category?.image || "", // Preserve old image if not uploading new
        }),
      });

      if (res.ok) {
        toast.success(category ? "Category updated!" : "Category created!");
        fetchCategories();
        setIsOpen(false);
      } else {
        toast.error("Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Server error");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Parent Category ID (Optional)" value={parentId} onChange={(e) => setParentId(e.target.value)} />
          <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{category ? "Update" : "Create"}</Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
