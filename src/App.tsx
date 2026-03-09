import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";
import SuperAdminShops from "./pages/SuperAdmin/Shops";
import SuperAdminReports from "./pages/SuperAdmin/Reports";
import SuperAdminSettings from "./pages/SuperAdmin/Settings";
import ShopDashboard from "./pages/ShopAdmin/Dashboard";
import POSBilling from "./pages/ShopAdmin/POSBilling";
import ShopItems from "./pages/ShopAdmin/Items";
import Transactions from "./pages/ShopAdmin/Transactions";
import ShopUsers from "./pages/ShopAdmin/Users";
import Reports from "./pages/ShopAdmin/Reports";
import ShopSettings from "./pages/ShopAdmin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/super-admin/shops" element={<SuperAdminShops />} />
            <Route path="/super-admin/reports" element={<SuperAdminReports />} />
            <Route path="/super-admin/settings" element={<SuperAdminSettings />} />
            <Route path="/shop/:shopId" element={<ShopDashboard />} />
            <Route path="/shop/:shopId/pos" element={<POSBilling />} />
            <Route path="/shop/:shopId/items" element={<ShopItems />} />
            <Route path="/shop/:shopId/transactions" element={<Transactions />} />
            <Route path="/shop/:shopId/users" element={<ShopUsers />} />
            <Route path="/shop/:shopId/reports" element={<Reports />} />
            <Route path="/shop/:shopId/settings" element={<ShopSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
