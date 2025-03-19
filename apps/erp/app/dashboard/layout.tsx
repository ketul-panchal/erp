// import type React from "react"
// import DashboardLayout from "@/components/dashboard-layout"

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return <DashboardLayout>{children}</DashboardLayout>
// }

import type React from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
      {/* ToastContainer should be here to globally handle all toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
