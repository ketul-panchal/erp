// "use client"

// import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
// import { useRouter } from "next/navigation"

// type User = {
//   id: string
//   name: string
//   email: string
//   avatar?: string
// }

// type AuthContextType = {
//   user: User | null
//   isLoading: boolean
//   login: (email: string, password: string) => Promise<void>
//   register: (name: string, email: string, password: string) => Promise<void>
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()

//   // Check for existing session on initial load
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user")
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser))
//       } catch (error) {
//         console.error("Failed to parse user from localStorage:", error)
//       }
//     }
//     setIsLoading(false)
//   }, [])

//   const login = async (email: string, password: string) => {
//     setIsLoading(true)

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       // For demo purposes, we'll just check if the email contains "test"
//       if (!email.includes("test")) {
//         throw new Error("Invalid credentials")
//       }

//       const newUser = {
//         id: "user-1",
//         name: email.split("@")[0],
//         email,
//         avatar: "/placeholder.svg?height=100&width=100",
//       }

//       setUser(newUser)
//       localStorage.setItem("user", JSON.stringify(newUser))
//       router.push("/profile")
//     } catch (error) {
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const register = async (name: string, email: string, password: string) => {
//     setIsLoading(true)

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       // For demo purposes, we'll just check if the email is already taken
//       if (email.includes("taken")) {
//         throw new Error("Email already taken")
//       }

//       const newUser = {
//         id: "user-" + Date.now(),
//         name,
//         email,
//         avatar: "/placeholder.svg?height=100&width=100",
//       }

//       setUser(newUser)
//       localStorage.setItem("user", JSON.stringify(newUser))
//       router.push("/profile")
//     } catch (error) {
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const logout = () => {
//     setUser(null)
//     localStorage.removeItem("user")
//     router.push("/login")
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading,
//         login,
//         register,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// auth-context.tsx

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import axios

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Call the backend API to authenticate the user
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user: loggedInUser } = response.data;

      // Save the user data and token in localStorage
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("token", token);  // Save the token for further authentication

      router.push("/profile");
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role: "user", // or get role based on your use case
      });

      const { user: newUser } = response.data;
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      router.push("/profile");
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
