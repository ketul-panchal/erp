// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Bar, Pie } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// export default function ReportsPage() {
//   const [salesReport, setSalesReport] = useState<any>(null);
//   const [stockReport, setStockReport] = useState<any>(null);
//   const [financialReport, setFinancialReport] = useState<any>(null);

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     const token = localStorage.getItem("token");

//     const fetchData = async (url: string) => {
//       const response = await fetch(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.ok ? response.json() : null;
//     };

//     setSalesReport(await fetchData("http://localhost:5000/api/reports/sales"));
//     setStockReport(await fetchData("http://localhost:5000/api/reports/stock"));
//     setFinancialReport(await fetchData("http://localhost:5000/api/reports/financial"));
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold">Reports Dashboard</h2>

//       {/* 📊 Sales Report */}
//       <Card className="mt-6">
//         <CardHeader><CardTitle>Sales Overview</CardTitle></CardHeader>
//         <CardContent>
//           {salesReport && (
//             <>
//               <p>Total Sales: {salesReport.totalSales}</p>
//               <p>Total Revenue: ${salesReport.totalRevenue}</p>
//               <Bar
//                 data={{
//                   labels: salesReport.bestSellingProducts.map((p: any) => p.name),
//                   datasets: [{ label: "Best-Selling Products", data: salesReport.bestSellingProducts.map((p: any) => p.stock), backgroundColor: "blue" }],
//                 }}
//               />
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* 📦 Stock Report */}
//       <Card className="mt-6">
//         <CardHeader><CardTitle>Stock Levels</CardTitle></CardHeader>
//         <CardContent>
//           {stockReport && (
//             <>
//               <p>Total Stock: {stockReport.totalStock}</p>
//               <Pie
//                 data={{
//                   labels: stockReport.lowStockProducts.map((p: any) => p.name),
//                   datasets: [{ data: stockReport.lowStockProducts.map((p: any) => p.stock), backgroundColor: ["red", "orange", "yellow"] }],
//                 }}
//               />
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* 💰 Financial Report */}
//       <Card className="mt-6">
//         <CardHeader><CardTitle>Financial Insights</CardTitle></CardHeader>
//         <CardContent>
//           {financialReport && (
//             <>
//               <p>Total Revenue: ${financialReport.totalRevenue}</p>
//               <p>Total Cost: ${financialReport.totalCost}</p>
//               <p>Total Profit: ${financialReport.totalProfit}</p>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Bar,
  Pie,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ReportsPage() {
  const [salesReport, setSalesReport] = useState<any>(null);
  const [stockReport, setStockReport] = useState<any>(null);
  const [financialReport, setFinancialReport] = useState<any>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem("token");

    const fetchData = async (url: string) => {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.ok ? response.json() : null;
    };

    setSalesReport(await fetchData("http://localhost:5000/api/reports/sales"));
    setStockReport(await fetchData("http://localhost:5000/api/reports/stock"));
    setFinancialReport(
      await fetchData("http://localhost:5000/api/reports/financial")
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-5">📊 Reports Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 🔥 Sales Overview */}
        <Card className="shadow-lg rounded-xl bg-white p-4">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-700">
              📈 Sales Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesReport ? (
              <>
                <p className="text-gray-600">Total Sales: <span className="font-semibold">{salesReport.totalSales}</span></p>
                <p className="text-gray-600">Total Revenue: <span className="font-semibold text-green-600">${salesReport.totalRevenue}</span></p>
                <Bar
                  data={{
                    labels: salesReport.bestSellingProducts.map((p: any) => p.name),
                    datasets: [
                      {
                        label: "Best-Selling Products",
                        data: salesReport.bestSellingProducts.map((p: any) => p.stock),
                        backgroundColor: "#6366F1", // Indigo color
                        borderRadius: 6,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                  }}
                />
              </>
            ) : (
              <p className="text-gray-500">No sales data available.</p>
            )}
          </CardContent>
        </Card>

        {/* 📦 Stock Levels */}
        <Card className="shadow-lg rounded-xl bg-white p-4">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-700">
              📦 Stock Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stockReport ? (
              <>
                <p className="text-gray-600">Total Stock: <span className="font-semibold">{stockReport.totalStock}</span></p>
                {stockReport.lowStockProducts.length > 0 ? (
                  <Pie
                    data={{
                      labels: stockReport.lowStockProducts.map((p: any) => p.name),
                      datasets: [
                        {
                          data: stockReport.lowStockProducts.map((p: any) => p.stock),
                          backgroundColor: ["#EF4444", "#F59E0B", "#6366F1"], // Red, Orange, Indigo
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                ) : (
                  <p className="text-green-600">All stock levels are healthy! ✅</p>
                )}
              </>
            ) : (
              <p className="text-gray-500">No stock data available.</p>
            )}
          </CardContent>
        </Card>

        {/* 💰 Financial Insights */}
        <Card className="shadow-lg rounded-xl bg-white p-4">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-700">
              💰 Financial Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {financialReport ? (
              <>
                <p className="text-gray-600">
                  Total Revenue: <span className="font-semibold text-green-600">${financialReport.totalRevenue}</span>
                </p>
                <p className="text-gray-600">
                  Total Cost: <span className="font-semibold text-red-500">${financialReport.totalCost}</span>
                </p>
                <p className="text-gray-600">
                  Total Profit: <span className={`font-semibold ${financialReport.totalProfit > 0 ? "text-green-600" : "text-red-500"}`}>
                    ${financialReport.totalProfit}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-gray-500">No financial data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
