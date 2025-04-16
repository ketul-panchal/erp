// "use client"

// import type React from "react"

// import { useState } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Eye, EyeOff } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { useAuth } from "@/context/auth-context"
// import { toast } from "@/hooks/use-toast"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")

//   const { login } = useAuth()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setIsLoading(true)

//     try {
//       await login(email, password)
//       toast({
//         title: "Login successful",
//         description: "Welcome back to LUXE!",
//       })
//     } catch (error) {
//       setError("Invalid email or password. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#f8f5f2] pt-20">
//       <div className="container px-4 py-16 mx-auto">
//         <div className="max-w-md mx-auto">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
//             <p className="text-muted-foreground">Sign in to your LUXE account</p>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-8">
//             {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="your@email.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="rounded-none"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <Label htmlFor="password">Password</Label>
//                   <Link href="/forgot-password" className="text-sm text-primary hover:underline">
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className="rounded-none pr-10"
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className="absolute right-0 top-0 h-full"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </Button>
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full bg-black hover:bg-black/90 text-white rounded-none"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Signing in..." : "Sign In"}
//               </Button>
//             </form>

//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <Separator />
//                 </div>
//                 {/* <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
//                 </div> */}
//               </div>

//               {/* <div className="flex gap-4 mt-6">
//                 <Button variant="outline" className="w-full rounded-none">
//                   <Image
//                     src="/placeholder.svg?height=20&width=20"
//                     alt="Google"
//                     width={20}
//                     height={20}
//                     className="mr-2"
//                   />
//                   Google
//                 </Button>
//                 <Button variant="outline" className="w-full rounded-none">
//                   <Image
//                     src="/placeholder.svg?height=20&width=20"
//                     alt="Apple"
//                     width={20}
//                     height={20}
//                     className="mr-2"
//                   />
//                   Apple
//                 </Button>
//               </div> */}
//             </div>

//             <div className="mt-8 text-center">
//               <p className="text-sm text-muted-foreground">
//                 Don't have an account?{" "}
//                 <Link href="/register" className="text-primary font-medium hover:underline">
//                   Create an account
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// login/page.tsx

"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to LUXE!",
      });
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] pt-20">
      <div className="container px-4 py-16 mx-auto">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your LUXE account</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-none pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-black hover:bg-black/90 text-white rounded-none"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
