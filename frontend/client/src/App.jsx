import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import FarmerLayout from "./layouts/FarmerLayout";
import BankLayout from "./layouts/BankLayout";
import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import FarmerRoute from "./routes/FarmerRoute";
import RoleRoute from "./routes/RoleRoute";

import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import SalesPage from "./pages/farmer/SalesPage";
import PurchasesPage from "./pages/farmer/PurchasesPage";
import LoansPage from "./pages/farmer/LoansPage";
import SummaryPage from "./pages/farmer/SummaryPage";

import FarmersPage from "./pages/bank/FarmersPage";
import BankLoansPage from "./pages/bank/BankLoansPage";
import BankFarmerDetailsPage from "./pages/bank/BankFarmerDetailsPage";

import AdminFarmersPage from "./pages/admin/AdminFarmersPage";
import AdminFarmerDetailsPage from "./pages/admin/AdminFarmerDetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<PublicLayout />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route
          element={
            <FarmerRoute>
              <FarmerLayout />
            </FarmerRoute>
          }
        >
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/farmer/sales" element={<SalesPage />} />
          <Route path="/farmer/purchases" element={<PurchasesPage />} />
          <Route path="/farmer/loans" element={<LoansPage />} />
          <Route path="/farmer/summary" element={<SummaryPage />} />
        </Route>

        <Route
          element={
            <RoleRoute role="bank">
              <BankLayout />
            </RoleRoute>
          }
        >
          <Route path="/bank" element={<Navigate to="/bank/farmers" replace />} />
          <Route path="/bank/farmers" element={<FarmersPage />} />
          <Route path="/bank/loans" element={<BankLoansPage />} />
          <Route
            path="/bank/farmers/:farmerId"
            element={<BankFarmerDetailsPage />}
          />
        </Route>

        <Route
          element={
            <RoleRoute role="admin">
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route path="/admin" element={<Navigate to="/admin/farmers" replace />} />
          <Route path="/admin/farmers" element={<AdminFarmersPage />} />
          <Route
            path="/admin/farmers/:farmerId"
            element={<AdminFarmerDetailsPage />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}