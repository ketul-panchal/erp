"use client";

import { useState, useEffect } from "react";
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
import { Plus, Edit, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import CategoryForm from "./category-form";

interface Category {
  id: string;
  name: string;
  parentId?: string | null;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setCategories((prev) =>
          prev.filter((category) => category.id !== categoryId)
        );
        toast.success("Category deleted successfully");
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category");
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Button
          className="bg-blue-600 text-white flex items-center"
          onClick={() => {
            setSelectedCategory(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-5 w-5" /> Add Category
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Category List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Parent ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id?.toString()}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.parentId || "None"}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          className="mr-2"
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow key="no-categories">
                    <TableCell colSpan={4} className="text-center">
                      No categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Category Form Dialog */}
      {isFormOpen && (
        <CategoryForm
          isOpen={isFormOpen}
          setIsOpen={setIsFormOpen}
          category={selectedCategory}
          setCategories={setCategories}
        />
      )}
    </div>
  );
}
