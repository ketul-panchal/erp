// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// // Validation Schema
// const loginSchema = z.object({
//   email: z.string().email("Invalid email format"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// export default function LoginPage() {
//   const router = useRouter();
//   const [serverError, setServerError] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: any) => {
//     setServerError("");

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//         credentials: "include",
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error || "Login failed");

//       localStorage.setItem("token", result.token);
//       router.push("/dashboard");
//     } catch (error: any) {
//       setServerError(error.message);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
//         <h2 className="text-2xl font-semibold text-center">Login</h2>
//         {serverError && <p className="text-red-500 text-sm mt-2">{serverError}</p>}
//         <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               {...register("email")}
//               type="email"
//               className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
//             />
//             {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//           </div>
//           <div className="mt-4">
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               {...register("password")}
//               type="password"
//               className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
//             />
//             {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//           </div>
//           <button type="submit" className="w-full mt-4 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Warehouse, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Validation Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("")
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Login failed")

      localStorage.setItem("token", result.token)
      router.push("/dashboard")
    } catch (error: any) {
      setServerError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md px-4">
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-primary/10 p-3">
                <Warehouse className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold">Warehouse ERP</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {serverError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
              </div>
              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="flex items-center justify-center text-xs text-muted-foreground mt-2">
              <ShieldCheck className="h-3 w-3 mr-1" />
              <span>Secure login for authorized personnel only</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

