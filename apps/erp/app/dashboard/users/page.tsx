"use client";

import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ FIX: Import Select from radix-ui (if not using shadcn/ui)
import * as Select from "@radix-ui/react-select";

const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "EMPLOYEE",
    password: "",
  });
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting user");
    }
  };

  const handleSaveUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = editingUser
        ? `http://localhost:5000/api/users/${editingUser.id}`
        : "http://localhost:5000/api/users";

      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            role: userData.role,
            ...(editingUser ? {} : { password: userData.password }), // Send password only for new users
          }),
      });

      if (response.ok) {
        // toast.success(
        //   editingUser
        //     ? "User updated successfully"
        //     : "User created successfully"
        // );

        toast.success(
            editingUser ? "User updated successfully" : "User created successfully"
          );
        // setUserData({ name: "", email: "", role: "employee", password: "" });
        // setEditingUser(null);
        fetchUsers();
        setOpen(false);
      } else {
        toast.error("Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("An error occurred while saving user");
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
    <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-600 text-white flex items-center"
              onClick={() => setEditingUser(null)}
            >
              <Plus className="mr-2 h-5 w-5" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="mb-2">Name</Label>
                <Input
                  value={userData.name || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label className="mb-2">Email</Label>
                <Input
                  type="email"
                  value={userData.email || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label className="mb-2">Password</Label>
                <Input
                  type="password"
                  value={userData.password || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label className="mb-2">Role</Label>
                <Select.Root
                  value={userData.role}
                  onValueChange={(value: string) =>
                    setUserData({ ...userData, role: value })
                  }
                >
                  <Select.Trigger className="border p-2 rounded">
                    <Select.Value>
                      {ROLES[userData.role as keyof typeof ROLES]}
                    </Select.Value>
                  </Select.Trigger>
                  <Select.Content className="border bg-white rounded">
                    {Object.entries(ROLES).map(([key, label]) => (
                      <Select.Item
                        key={key}
                        value={key}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveUser}>
                {editingUser ? "Update User" : "Create User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          className="mr-2"
                          onClick={() => {
                            setEditingUser(user);
                            setUserData({
                              name: user.name,
                              email: user.email,
                              role: user.role,
                              password: user.password,
                            });
                            setOpen(true);
                          }}
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
